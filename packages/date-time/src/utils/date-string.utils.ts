import { isRealGregorianDay } from "./gregorian.utils.js";

/**
 * A strict date string split into fields.
 *
 * `offsetMinutes` is present only for a date-time. `Z` is `0`. A calendar
 * date has no offset; the caller supplies the time zone.
 */
export interface StrictDateString {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    offsetMinutes?: number;
}

/** A `YYYY-MM-DD` calendar date. The day must exist in that month. */
const calendarDateExpression = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;

/**
 * `YYYY-MM-DDTHH:mm[:ss[.sss]](Z|±HH:mm|±HHmm)`.
 *
 * `T` and `Z` may be any case. Fractional seconds are one to three digits.
 */
const dateTimeExpression = new RegExp(
    "^" +
        "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})" +
        "[Tt](?<hour>\\d{2}):(?<minute>\\d{2})" +
        "(?::(?<second>\\d{2})(?:\\.(?<fraction>\\d{1,3}))?)?" +
        "(?:[Zz]|(?<offsetSign>[+-])(?:(?<offsetHour>\\d{2}):(?<offsetMinute>\\d{2})|(?<offsetBasic>\\d{4})))" +
        "$",
);

/**
 * Parses a strict calendar date or date-time string.
 *
 * The text is checked directly. `Date.parse` overflows `2024-02-30` into
 * March and reads a missing offset in the local time zone. This parser
 * does neither. A date-time with no offset does not match.
 *
 * @param value - The candidate string, with no trimming.
 * @returns The fields, or `undefined` when the text is not a real date.
 */
export function parseStrictDateString(
    value: string,
): StrictDateString | undefined {
    const calendarDate = parseCalendarDate(value);
    if (calendarDate !== undefined) {
        return calendarDate;
    }
    return parseDateTime(value);
}

/**
 * @param value - A candidate `YYYY-MM-DD` string.
 * @returns The calendar fields, or `undefined` when the day does not exist.
 */
function parseCalendarDate(value: string): StrictDateString | undefined {
    const groups = calendarDateExpression.exec(value)?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const year = readGroup(groups, "year");
    const month = readGroup(groups, "month");
    const day = readGroup(groups, "day");
    if (year === undefined || month === undefined || day === undefined) {
        return undefined;
    }
    if (!isRealGregorianDay(year, month, day)) {
        return undefined;
    }
    return {
        year,
        month,
        day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
    };
}

/**
 * @param value - A candidate date-time string.
 * @returns The fields and offset, or `undefined` when the text does not match.
 */
function parseDateTime(value: string): StrictDateString | undefined {
    const groups = dateTimeExpression.exec(value)?.groups;
    if (groups === undefined) {
        return undefined;
    }
    const year = readGroup(groups, "year");
    const month = readGroup(groups, "month");
    const day = readGroup(groups, "day");
    const hour = readGroup(groups, "hour");
    const minute = readGroup(groups, "minute");
    if (
        year === undefined ||
        month === undefined ||
        day === undefined ||
        hour === undefined ||
        minute === undefined
    ) {
        return undefined;
    }
    const second = readOptionalGroup(groups, "second");
    if (
        !isRealGregorianDay(year, month, day) ||
        hour > 23 ||
        minute > 59 ||
        (second !== undefined && second > 59)
    ) {
        return undefined;
    }
    const offsetMinutes = readOffsetMinutes(groups);
    if (offsetMinutes === undefined) {
        return undefined;
    }
    return {
        year,
        month,
        day,
        hour,
        minute,
        second: second ?? 0,
        millisecond: fractionToMilliseconds(groups.fraction),
        offsetMinutes,
    };
}

/**
 * @param groups - Named captures from a successful match.
 * @param name - The capture name.
 * @returns The parsed number, or `undefined` when the capture is absent.
 */
function readGroup(
    groups: Record<string, string | undefined>,
    name: string,
): number | undefined {
    const text = groups[name];
    if (text === undefined) {
        return undefined;
    }
    return Number(text);
}

/**
 * @param groups - Named captures from a successful match.
 * @param name - The capture name.
 * @returns The parsed number, or `undefined` when the capture is absent.
 */
function readOptionalGroup(
    groups: Record<string, string | undefined>,
    name: string,
): number | undefined {
    return readGroup(groups, name);
}

/**
 * @param fraction - One to three fractional-second digits.
 * @returns Whole milliseconds. Missing digits are treated as zero.
 */
function fractionToMilliseconds(fraction: string | undefined): number {
    if (fraction === undefined) {
        return 0;
    }
    return Number(fraction.padEnd(3, "0"));
}

/**
 * @param groups - Named captures that include the offset, if any.
 * @returns Offset minutes, `0` for `Z`, or `undefined` when the offset is out of range.
 */
function readOffsetMinutes(
    groups: Record<string, string | undefined>,
): number | undefined {
    if (groups.offsetSign === undefined) {
        return 0;
    }
    const sign = groups.offsetSign === "-" ? -1 : 1;
    const basic = groups.offsetBasic;
    const hourText =
        basic === undefined ? groups.offsetHour : basic.slice(0, 2);
    const minuteText =
        basic === undefined ? groups.offsetMinute : basic.slice(2);
    if (hourText === undefined || minuteText === undefined) {
        return undefined;
    }
    const hours = Number(hourText);
    const minutes = Number(minuteText);
    if (hours > 23 || minutes > 59) {
        return undefined;
    }
    return sign * (hours * 60 + minutes);
}
