import { readUtcParts, utcEpochMilliseconds } from "./gregorian.utils.js";

const shortWeekdays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
] as const;
const longWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;
const shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
] as const;

const fixdateExpression =
    /^(?<weekday>Sun|Mon|Tue|Wed|Thu|Fri|Sat), (?<day>\d{2}) (?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<year>\d{4}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2}) GMT$/;

const rfc850Expression =
    /^(?<weekday>Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), (?<day>\d{2})-(?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(?<year>\d{2}) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2}) GMT$/;

const asctimeExpression =
    /^(?<weekday>Sun|Mon|Tue|Wed|Thu|Fri|Sat) (?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<day>[\d ]\d) (?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2}) (?<year>\d{4})$/;

/**
 * Formats an instant as an IMF-fixdate in GMT.
 *
 * @param epochMilliseconds - Unix time in milliseconds.
 * @returns `Thu, 26 Nov 2026 22:00:00 GMT`.
 */
export function formatHttpDateText(epochMilliseconds: number): string {
    const parts = readUtcParts(epochMilliseconds);
    const weekday =
        shortWeekdays[new Date(epochMilliseconds).getUTCDay()] ?? "Thu";
    const month = shortMonths[parts.month - 1] ?? "Jan";
    return `${weekday}, ${pad(parts.day)} ${month} ${padYear(parts.year)} ${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)} GMT`;
}

/**
 * Parses an HTTP date in IMF-fixdate, RFC 850, or asctime form.
 *
 * A two-digit year from 00 through 49 is 20xx unless that year is more
 * than 50 years after the current year, in which case it is 19xx. Years
 * 50 through 99 are 19xx.
 *
 * @param value - The candidate text.
 * @param now - The instant used for the two-digit-year window.
 * @returns The instant, or `undefined` when the text does not match.
 */
export function parseHttpDateText(
    value: string,
    now: number,
): number | undefined {
    const fixdate = fixdateExpression.exec(value)?.groups;
    if (fixdate !== undefined) {
        return buildHttpInstant(fixdate, 4);
    }
    const rfc850 = rfc850Expression.exec(value)?.groups;
    if (rfc850 !== undefined) {
        const year = expandTwoDigitYear(Number(rfc850.year), now);
        return buildHttpInstant({ ...rfc850, year: String(year) }, 4);
    }
    const asctime = asctimeExpression.exec(value)?.groups;
    if (asctime !== undefined) {
        return buildHttpInstant({ ...asctime, day: asctime.day?.trim() }, 4);
    }
    return undefined;
}

/**
 * @param groups - Named date fields. `year` may already be four digits.
 * @param yearLength - Expected digit count before expansion. Unused after expansion.
 * @returns The instant when the calendar day is real and the weekday matches.
 */
function buildHttpInstant(
    groups: Record<string, string | undefined>,
    yearLength: number,
): number | undefined {
    void yearLength;
    const year = Number(groups.year);
    const month =
        shortMonths.indexOf(groups.month as (typeof shortMonths)[number]) + 1;
    const day = Number(groups.day);
    const hour = Number(groups.hour);
    const minute = Number(groups.minute);
    const second = Number(groups.second);
    if (
        month < 1 ||
        hour > 23 ||
        minute > 59 ||
        second > 59 ||
        !Number.isInteger(day)
    ) {
        return undefined;
    }
    const instant = utcEpochMilliseconds(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        0,
    );
    const parts = readUtcParts(instant);
    if (parts.year !== year || parts.month !== month || parts.day !== day) {
        return undefined;
    }
    const weekday = new Date(instant).getUTCDay();
    const shortName = shortWeekdays[weekday];
    const longName = longWeekdays[weekday];
    if (groups.weekday !== shortName && groups.weekday !== longName) {
        return undefined;
    }
    return instant;
}

/**
 * @param year - A year from 0 through 99.
 * @param now - The reference instant.
 * @returns A four-digit year.
 */
function expandTwoDigitYear(year: number, now: number): number {
    if (year >= 50) {
        return 1900 + year;
    }
    const candidate = 2000 + year;
    const currentYear = readUtcParts(now).year;
    if (candidate - currentYear > 50) {
        return 1900 + year;
    }
    return candidate;
}

/**
 * @param value - A number from 0 through 59.
 * @returns Two digits.
 */
function pad(value: number): string {
    return String(value).padStart(2, "0");
}

/**
 * @param year - A full year.
 * @returns Four digits.
 */
function padYear(year: number): string {
    return String(year).padStart(4, "0");
}
