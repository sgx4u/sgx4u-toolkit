import { isRealGregorianDay } from "./gregorian.utils.js";
import { UTCEpochMilliseconds } from "./gregorian.utils.js";
import { instantFromWallTime, readDateParts } from "./time-zone.utils.js";
import { parseFixedOffsetMinutes } from "./time-zone.utils.js";

/**
 * A lenient ISO date-time, including an optional RFC 9557 zone suffix.
 */
export interface LenientISODateTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    offsetMinutes?: number;
    timeZoneName?: string;
}

const calendarExpression = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;

const lenientDateTimeExpression = new RegExp(
    "^" +
        "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})" +
        "[Tt](?<hour>\\d{2}):(?<minute>\\d{2})" +
        "(?::(?<second>\\d{2})(?:\\.(?<fraction>\\d+))?)?" +
        "(?:(?<zulu>[Zz])|(?<offsetSign>[+-])(?:(?<offsetHour>\\d{2}):(?<offsetMinute>\\d{2})|(?<offsetBasic>\\d{4})))?" +
        "(?:\\[(?<zone>[^\\]]+)\\])?" +
        "$",
);

/**
 * Parses a `YYYY-MM-DD` string into a real calendar day.
 *
 * @param value - The candidate text.
 * @returns The calendar fields, or `undefined` when the day does not exist.
 */
export function parseCalendarText(
    value: string,
): { year: number; month: number; day: number } | undefined {
    const groups = calendarExpression.exec(value)?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const year = Number(groups.year);
    const month = Number(groups.month);
    const day = Number(groups.day);
    if (!isRealGregorianDay(year, month, day)) {
        return undefined;
    }
    return { year, month, day };
}

/**
 * Parses an ISO date-time, allowing extra fractional digits and a zone suffix.
 *
 * Fractions longer than three digits are truncated to milliseconds. A
 * missing offset is allowed; the caller decides whether a default zone
 * can fill it. The calendar day must exist.
 *
 * @param value - The candidate text.
 * @returns The fields, or `undefined` when the text does not match.
 */
export function parseLenientISODateTime(
    value: string,
): LenientISODateTime | undefined {
    const groups = lenientDateTimeExpression.exec(value)?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const year = Number(groups.year);
    const month = Number(groups.month);
    const day = Number(groups.day);
    const hour = Number(groups.hour);
    const minute = Number(groups.minute);
    const second = groups.second === undefined ? 0 : Number(groups.second);
    if (
        !isRealGregorianDay(year, month, day) ||
        hour > 23 ||
        minute > 59 ||
        second > 59
    ) {
        return undefined;
    }
    const parsed: LenientISODateTime = {
        year,
        month,
        day,
        hour,
        minute,
        second,
        millisecond: truncateFraction(groups.fraction),
    };
    if (groups.zulu !== undefined) {
        parsed.offsetMinutes = 0;
    } else if (groups.offsetSign !== undefined) {
        const basic = groups.offsetBasic;
        const offsetHour = Number(
            basic === undefined ? groups.offsetHour : basic.slice(0, 2),
        );
        const offsetMinute = Number(
            basic === undefined ? groups.offsetMinute : basic.slice(2),
        );
        if (offsetHour > 23 || offsetMinute > 59) {
            return undefined;
        }
        const magnitude = offsetHour * 60 + offsetMinute;
        parsed.offsetMinutes =
            groups.offsetSign === "-" ? -magnitude : magnitude;
    }
    if (groups.zone !== undefined) {
        parsed.timeZoneName = groups.zone;
    }
    return parsed;
}

/**
 * Writes a calendar date as `YYYY-MM-DD`.
 *
 * @param year - Full year. Years outside 0 through 9999 are signed and padded.
 * @param month - Month from 1 through 12.
 * @param day - Day of the month.
 * @returns The calendar date text.
 */
export function formatCalendarText(
    year: number,
    month: number,
    day: number,
): string {
    return `${padYear(year)}-${pad(month)}-${pad(day)}`;
}

/**
 * Writes an offset as `Z` or `±HH:mm`.
 *
 * @param offsetMinutes - Minutes east of UTC. A fraction is rounded to the nearest minute for display.
 * @param useZuluForZero - Whether a zero offset is `Z`.
 * @returns The offset text.
 */
export function formatOffsetText(
    offsetMinutes: number,
    useZuluForZero: boolean,
): string {
    if (offsetMinutes === 0 && useZuluForZero) {
        return "Z";
    }
    const sign = offsetMinutes < 0 ? "-" : "+";
    const absolute = Math.abs(Math.round(offsetMinutes));
    const hours = Math.floor(absolute / 60);
    const minutes = absolute % 60;
    return `${sign}${pad(hours)}:${pad(minutes)}`;
}

/**
 * The instant named by a lenient ISO date-time.
 *
 * When an offset and a bracketed zone both exist and disagree, the result
 * is `undefined`. A missing offset uses `defaultTimeZone`.
 *
 * @param parsed - Fields from `parseLenientISODateTime`.
 * @param defaultTimeZone - Zone used when the text has no offset.
 * @param disambiguation - How a zone-only time resolves a gap or overlap.
 * @returns The instant, or `undefined` when the text cannot be placed.
 */
export function instantFromLenientISO(
    parsed: LenientISODateTime,
    defaultTimeZone: string | undefined,
    disambiguation: "compatible" | "earlier" | "later" | "reject",
): number | undefined {
    const wall = {
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        hour: parsed.hour,
        minute: parsed.minute,
        second: parsed.second,
        millisecond: parsed.millisecond,
    };
    if (parsed.offsetMinutes !== undefined) {
        const utc = UTCEpochMilliseconds(
            parsed.year,
            parsed.month - 1,
            parsed.day,
            parsed.hour,
            parsed.minute,
            parsed.second,
            parsed.millisecond,
        );
        const instant = utc - parsed.offsetMinutes * 60_000;
        if (parsed.timeZoneName !== undefined) {
            try {
                const zoneOffset = readDateParts(
                    instant,
                    parsed.timeZoneName,
                ).offsetMinutes;
                if (Math.abs(zoneOffset - parsed.offsetMinutes) > 0.001) {
                    return undefined;
                }
            } catch {
                return undefined;
            }
        }
        return instant;
    }
    const zone = parsed.timeZoneName ?? defaultTimeZone;
    if (zone === undefined) {
        return undefined;
    }
    if (parseFixedOffsetMinutes(zone) === undefined) {
        try {
            return instantFromWallTime(wall, zone, disambiguation);
        } catch {
            return undefined;
        }
    }
    return instantFromWallTime(wall, zone, disambiguation);
}

/**
 * @param fraction - Fractional second digits, possibly longer than three.
 * @returns Milliseconds, truncating extra digits.
 */
function truncateFraction(fraction: string | undefined): number {
    if (fraction === undefined) {
        return 0;
    }
    return Number(fraction.slice(0, 3).padEnd(3, "0"));
}

/**
 * @param value - A number from 0 through 99.
 * @returns Two digits.
 */
function pad(value: number): string {
    return String(value).padStart(2, "0");
}

/**
 * @param year - A year that may be outside four digits.
 * @returns At least four digits, with a sign when the year is negative.
 */
function padYear(year: number): string {
    const absolute = String(Math.abs(year)).padStart(4, "0");
    return year < 0 ? `-${absolute}` : absolute;
}
