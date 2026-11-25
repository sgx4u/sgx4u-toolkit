/**
 * Days in each month of a non-leap year.
 *
 * Index 0 is unused so a month number from 1 to 12 can be used directly.
 * February is 28 here. A leap year allows the 29th.
 */
const daysInCommonMonth: readonly number[] = [
    0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

/** A `YYYY-MM-DD` calendar date. The day must exist in that month. */
const calendarDateExpression = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;

/**
 * `YYYY-MM-DDTHH:mm[:ss[.sss]](Z|±HH:mm)`.
 *
 * `T` and `Z` may be any case. The offset uses a colon. Fractional seconds
 * are one to three digits.
 */
const dateTimeExpression = new RegExp(
    "^" +
        "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})" +
        "[Tt](?<hour>\\d{2}):(?<minute>\\d{2})" +
        "(?::(?<second>\\d{2})(?:\\.\\d{1,3})?)?" +
        "(?:[Zz]|[+-](?<offsetHour>\\d{2}):(?<offsetMinute>\\d{2}))" +
        "$",
);

/**
 * Reports whether `value` is a real date.
 *
 * Call this before using a `Date`, a millisecond timestamp, or a date
 * string that may be missing or malformed. Ordinary invalid input returns
 * `false`. The function does not throw for those values.
 *
 * A `Date` is valid when its time value is finite. A `number` is Unix time
 * in milliseconds and is valid on the range `-8640000000000000` through
 * `8640000000000000`, including fractions that `Date` can store. A string
 * is valid when it is a real `YYYY-MM-DD` calendar date, or a date-time
 * with an explicit `Z` or `±HH:mm` offset and in-range clock fields.
 * `2024-02-30` is invalid. The day stays in February.
 *
 * @param value - A `Date`, a millisecond timestamp, a date string, or any other value. Other values are invalid.
 * @returns `true` when `value` is a real date.
 * @remarks `null`, `undefined`, `""`, `NaN`, infinities, `Invalid Date`,
 * booleans, and other objects return `false`. A date-time with no offset
 * is invalid, so the result does not depend on the local timezone. Hour
 * `24`, a leap second, and more than three fractional digits are invalid.
 * `Date.parse("2024-02-30")` overflows into March. This function returns
 * `false` for that string. A `Date` built from that string is valid when
 * the resulting instant is finite, because the overflow already happened.
 * A numeric string is not a timestamp. Years are four digits, from `0000`
 * through `9999`. A `Date` created in another realm is not recognized.
 * @example
 * isValidDate("2024-02-29");
 * @example
 * isValidDate("2024-02-30");
 */
export function isValidDate(value: unknown): boolean {
    if (value instanceof Date) {
        return Number.isFinite(value.getTime());
    }
    if (typeof value === "number") {
        return isFiniteTimestamp(value);
    }
    if (typeof value === "string") {
        return isValidDateString(value);
    }
    return false;
}

/**
 * Whether `year` has a February 29 in the proleptic Gregorian calendar.
 *
 * Year 0 is a leap year. A year divisible by 100 is a leap year only when
 * it is also divisible by 400.
 *
 * @param year - A four-digit calendar year, from 0 through 9999.
 * @returns `true` when February has 29 days.
 */
function isLeapYear(year: number): boolean {
    if (year % 400 === 0) {
        return true;
    }
    if (year % 100 === 0) {
        return false;
    }
    return year % 4 === 0;
}

/**
 * Whether the calendar day exists.
 *
 * @param year - Full year, already parsed from four digits.
 * @param month - Month number, from 1 through 12 when the day can exist.
 * @param day - Day of the month, starting at 1.
 * @returns `true` when that month contains `day`.
 */
function isRealYearMonthDay(year: number, month: number, day: number): boolean {
    if (month < 1 || month > 12 || day < 1) {
        return false;
    }
    const daysInMonth = daysInCommonMonth[month];
    if (daysInMonth === undefined) {
        return false;
    }
    const maximumDay = month === 2 && isLeapYear(year) ? 29 : daysInMonth;
    return day <= maximumDay;
}

/**
 * Whether `timestamp` is a finite instant `Date` can store.
 *
 * `NaN`, infinities, and values outside ±8.64e15 milliseconds become an
 * Invalid Date. A fractional millisecond is valid when the stored instant
 * is finite.
 *
 * @param timestamp - Unix time in milliseconds.
 * @returns `true` when `new Date(timestamp)` has a finite time value.
 */
function isFiniteTimestamp(timestamp: number): boolean {
    return Number.isFinite(new Date(timestamp).getTime());
}

/**
 * Whether `value` matches a real calendar date or a real date-time.
 *
 * The text is checked directly. `Date.parse` overflows `2024-02-30` into
 * March and reads a missing offset in the local timezone.
 *
 * @param value - The candidate date string, with no trimming.
 * @returns `true` when the string is a real date.
 */
function isValidDateString(value: string): boolean {
    if (isValidCalendarDate(value)) {
        return true;
    }
    return isValidDateTime(value);
}

/**
 * @param value - A candidate `YYYY-MM-DD` string.
 * @returns `true` when the string is that format and the day exists.
 */
function isValidCalendarDate(value: string): boolean {
    const groups = calendarDateExpression.exec(value)?.groups;
    if (groups === undefined) {
        return false;
    }
    const yearText = groups.year;
    const monthText = groups.month;
    const dayText = groups.day;
    if (
        yearText === undefined ||
        monthText === undefined ||
        dayText === undefined
    ) {
        return false;
    }
    return isRealYearMonthDay(
        Number(yearText),
        Number(monthText),
        Number(dayText),
    );
}

/**
 * @param value - A candidate date-time string.
 * @returns `true` when the calendar day and the clock fields exist.
 */
function isValidDateTime(value: string): boolean {
    const groups = dateTimeExpression.exec(value)?.groups;
    if (groups === undefined) {
        return false;
    }
    const yearText = groups.year;
    const monthText = groups.month;
    const dayText = groups.day;
    const hourText = groups.hour;
    const minuteText = groups.minute;
    if (
        yearText === undefined ||
        monthText === undefined ||
        dayText === undefined ||
        hourText === undefined ||
        minuteText === undefined
    ) {
        return false;
    }
    return (
        isRealYearMonthDay(
            Number(yearText),
            Number(monthText),
            Number(dayText),
        ) &&
        isValidClock(hourText, minuteText, groups.second) &&
        isValidOffset(groups.offsetHour, groups.offsetMinute)
    );
}

/**
 * @param hourText - Two digits, `00` through `23` when valid.
 * @param minuteText - Two digits, `00` through `59` when valid.
 * @param secondText - Two digits when seconds were present.
 * @returns `true` when the clock fields are in range. Hour `24` and second `60` are invalid.
 */
function isValidClock(
    hourText: string,
    minuteText: string,
    secondText: string | undefined,
): boolean {
    if (Number(hourText) > 23 || Number(minuteText) > 59) {
        return false;
    }
    if (secondText !== undefined && Number(secondText) > 59) {
        return false;
    }
    return true;
}

/**
 * @param offsetHourText - Offset hours when the string uses `±HH:mm`. Absent for `Z`.
 * @param offsetMinuteText - Offset minutes when the string uses `±HH:mm`. Absent for `Z`.
 * @returns `true` for `Z`, and for an offset whose hours are `00`–`23` and minutes are `00`–`59`.
 */
function isValidOffset(
    offsetHourText: string | undefined,
    offsetMinuteText: string | undefined,
): boolean {
    if (offsetHourText === undefined && offsetMinuteText === undefined) {
        return true;
    }
    if (offsetHourText === undefined || offsetMinuteText === undefined) {
        return false;
    }
    return Number(offsetHourText) <= 23 && Number(offsetMinuteText) <= 59;
}
