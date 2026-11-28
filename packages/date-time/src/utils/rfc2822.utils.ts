import { readUTCParts, UTCEpochMilliseconds } from "./gregorian.utils.js";
import { formatCalendarText } from "./iso.utils.js";

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

const obsoleteOffsets: Readonly<Record<string, number>> = {
    UT: 0,
    GMT: 0,
    EST: -5 * 60,
    EDT: -4 * 60,
    CST: -6 * 60,
    CDT: -5 * 60,
    MST: -7 * 60,
    MDT: -6 * 60,
    PST: -8 * 60,
    PDT: -7 * 60,
};

const rfc2822Expression = new RegExp(
    "^(?:(?<weekday>Sun|Mon|Tue|Wed|Thu|Fri|Sat),\\s+)?" +
        "(?<day>\\d{1,2})\\s+" +
        "(?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+" +
        "(?<year>\\d{2,4})\\s+" +
        "(?<hour>\\d{2}):(?<minute>\\d{2})(?::(?<second>\\d{2}))?\\s+" +
        "(?:(?<sign>[+-])(?<offsetHour>\\d{2})(?<offsetMinute>\\d{2})|(?<zone>UT|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT))$",
    "i",
);

/**
 * Parses an RFC 2822 date.
 *
 * The weekday is optional. Seconds are optional. The zone may be a numeric
 * offset or one of the obsolete names `UT`, `GMT`, `EST`, `EDT`, `CST`,
 * `CDT`, `MST`, `MDT`, `PST`, and `PDT`.
 *
 * @param value - The candidate text.
 * @returns The instant, or `undefined` when the text does not match.
 */
export function parseRFC2822Text(value: string): number | undefined {
    const groups = rfc2822Expression.exec(value.trim())?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const month =
        shortMonths.findIndex(
            (name) => name.toLowerCase() === groups.month?.toLowerCase(),
        ) + 1;
    const yearText = groups.year ?? "";
    const year =
        yearText.length === 2 ? expandYear(Number(yearText)) : Number(yearText);
    const day = Number(groups.day);
    const hour = Number(groups.hour);
    const minute = Number(groups.minute);
    const second = groups.second === undefined ? 0 : Number(groups.second);
    if (month < 1 || hour > 23 || minute > 59 || second > 59) {
        return undefined;
    }
    const offsetMinutes = readOffset(groups);
    if (offsetMinutes === undefined) {
        return undefined;
    }
    const utc = UTCEpochMilliseconds(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        0,
    );
    const instant = utc - offsetMinutes * 60_000;
    const check = readUTCParts(utc);
    if (check.year !== year || check.month !== month || check.day !== day) {
        return undefined;
    }
    return instant;
}

/**
 * Formats an instant as an RFC 2822 date with a numeric offset.
 *
 * @param epochMilliseconds - The instant.
 * @param offsetMinutes - The zone offset in minutes.
 * @param weekday - The short weekday name.
 * @param day - The day of the month.
 * @param month - The month from 1 through 12.
 * @param year - The full year.
 * @param hour - The hour.
 * @param minute - The minute.
 * @param second - The second.
 * @returns `Thu, 26 Nov 2026 03:30:00 +0530`.
 */
export function formatRFC2822Text(
    weekday: string,
    day: number,
    month: number,
    year: number,
    hour: number,
    minute: number,
    second: number,
    offsetMinutes: number,
): string {
    const monthName = shortMonths[month - 1] ?? "Jan";
    const sign = offsetMinutes < 0 ? "-" : "+";
    const absolute = Math.abs(Math.round(offsetMinutes));
    const offset = `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}${String(absolute % 60).padStart(2, "0")}`;
    return `${weekday}, ${String(day).padStart(2, "0")} ${monthName} ${formatCalendarText(year, 1, 1).slice(0, 4)} ${pad(hour)}:${pad(minute)}:${pad(second)} ${offset}`;
}

/**
 * @param groups - Captures from a successful match.
 * @returns Offset minutes, or `undefined` when the zone is unknown.
 */
function readOffset(
    groups: Record<string, string | undefined>,
): number | undefined {
    if (groups.sign !== undefined) {
        const hours = Number(groups.offsetHour);
        const minutes = Number(groups.offsetMinute);
        if (hours > 23 || minutes > 59) {
            return undefined;
        }
        const magnitude = hours * 60 + minutes;
        return groups.sign === "-" ? -magnitude : magnitude;
    }
    const zone = groups.zone?.toUpperCase();
    if (zone === undefined) {
        return undefined;
    }
    return obsoleteOffsets[zone];
}

/**
 * @param year - A two-digit year.
 * @returns 19xx when the year is 50 through 99, otherwise 20xx.
 */
function expandYear(year: number): number {
    return year >= 50 ? 1900 + year : 2000 + year;
}

/**
 * @param value - A clock field.
 * @returns Two digits.
 */
function pad(value: number): string {
    return String(value).padStart(2, "0");
}
