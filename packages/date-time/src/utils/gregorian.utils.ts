import type { Weekday } from "../types/time.types.js";

/**
 * Days in each month of a non-leap year.
 *
 * Index 0 is unused so a month number from 1 to 12 can be used directly.
 */
const daysInCommonMonth: readonly number[] = [
    0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

const millisecondsPerDay = 86_400_000;

/**
 * Wall-clock fields with no zone attached. Months are 1 through 12.
 */
export interface GregorianParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

/**
 * Whether `year` has a February 29 in the proleptic Gregorian calendar.
 *
 * Year 0 is a leap year. A century year is a leap year only when it is
 * also divisible by 400. Negative years use the same rule.
 *
 * @param year - A Gregorian year. It is not range-checked.
 * @returns `true` when February has 29 days.
 */
export function isGregorianLeapYear(year: number): boolean {
    if (year % 400 === 0) {
        return true;
    }
    if (year % 100 === 0) {
        return false;
    }
    return year % 4 === 0;
}

/**
 * @param year - A Gregorian year.
 * @param month - Month number from 1 through 12.
 * @returns The number of days in that month, or `0` when `month` is outside 1 through 12.
 */
export function daysInGregorianMonth(year: number, month: number): number {
    if (month === 2 && isGregorianLeapYear(year)) {
        return 29;
    }
    return daysInCommonMonth[month] ?? 0;
}

/**
 * Whether the calendar day exists.
 *
 * @param year - Full year.
 * @param month - Month number.
 * @param day - Day of the month, starting at 1.
 * @returns `true` when that month contains `day`.
 */
export function isRealGregorianDay(
    year: number,
    month: number,
    day: number,
): boolean {
    if (month < 1 || month > 12 || day < 1) {
        return false;
    }
    return day <= daysInGregorianMonth(year, month);
}

/**
 * Unix milliseconds for a UTC wall time.
 *
 * Years 0 through 99 are kept as written. `Date.UTC` would otherwise
 * treat them as 1900 through 1999.
 *
 * @param year - Full year.
 * @param monthIndex - Month index from 0 through 11.
 * @param day - Day of the month.
 * @param hour - Hour from 0 through 23.
 * @param minute - Minute from 0 through 59.
 * @param second - Second from 0 through 59.
 * @param millisecond - Millisecond from 0 through 999.
 * @returns The matching Unix time in milliseconds.
 */
export function utcEpochMilliseconds(
    year: number,
    monthIndex: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    millisecond: number,
): number {
    const date = new Date(
        Date.UTC(year, monthIndex, day, hour, minute, second, millisecond),
    );
    if (year >= 0 && year < 100) {
        date.setUTCFullYear(year, monthIndex, day);
        date.setUTCHours(hour, minute, second, millisecond);
    }
    return date.getTime();
}

/**
 * UTC wall-clock fields of an instant.
 *
 * @param epochMilliseconds - Unix time in milliseconds.
 * @returns The proleptic Gregorian fields in UTC.
 */
export function readUtcParts(epochMilliseconds: number): GregorianParts {
    const date = new Date(epochMilliseconds);
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds(),
    };
}

/**
 * ISO weekday of a Gregorian calendar date.
 *
 * @param year - Full year.
 * @param month - Month number from 1 through 12.
 * @param day - Day of the month.
 * @returns `1` for Monday through `7` for Sunday.
 */
export function isoWeekdayNumber(
    year: number,
    month: number,
    day: number,
): Weekday {
    const epochMilliseconds = utcEpochMilliseconds(
        year,
        month - 1,
        day,
        0,
        0,
        0,
        0,
    );
    const javascriptWeekday = new Date(epochMilliseconds).getUTCDay();
    if (javascriptWeekday === 0) {
        return 7;
    }
    return javascriptWeekday as Weekday;
}

/**
 * Moves a calendar date by a whole number of days.
 *
 * @param year - Full year.
 * @param month - Month number from 1 through 12.
 * @param day - Day of the month.
 * @param dayCount - Days to add. Negative values move backward.
 * @returns The resulting calendar date.
 */
export function addGregorianDays(
    year: number,
    month: number,
    day: number,
    dayCount: number,
): { year: number; month: number; day: number } {
    const epochMilliseconds =
        utcEpochMilliseconds(year, month - 1, day, 0, 0, 0, 0) +
        dayCount * millisecondsPerDay;
    const parts = readUtcParts(epochMilliseconds);
    return { year: parts.year, month: parts.month, day: parts.day };
}

/**
 * Moves a calendar date by a whole number of months.
 *
 * The day is kept when the target month has it. Otherwise `constrain`
 * uses the month's last day and `reject` throws.
 *
 * @param year - Full year.
 * @param month - Month number from 1 through 12.
 * @param day - Day of the month.
 * @param monthCount - Months to add. Negative values move backward.
 * @param overflow - What to do when the day does not exist.
 * @returns The resulting calendar date.
 * @throws {@link RangeError} When `overflow` is `"reject"` and the day does not exist.
 */
export function addGregorianMonths(
    year: number,
    month: number,
    day: number,
    monthCount: number,
    overflow: "constrain" | "reject",
): { year: number; month: number; day: number } {
    const monthIndex = month - 1 + monthCount;
    const nextYear = year + Math.floor(monthIndex / 12);
    const nextMonth = (((monthIndex % 12) + 12) % 12) + 1;
    const maximumDay = daysInGregorianMonth(nextYear, nextMonth);
    if (day > maximumDay) {
        if (overflow === "reject") {
            throw new RangeError(
                `\`duration\` lands on day ${String(day)} of ${String(nextYear)}-${String(nextMonth).padStart(2, "0")}, which is not a real day.`,
            );
        }
        return { year: nextYear, month: nextMonth, day: maximumDay };
    }
    return { year: nextYear, month: nextMonth, day };
}
