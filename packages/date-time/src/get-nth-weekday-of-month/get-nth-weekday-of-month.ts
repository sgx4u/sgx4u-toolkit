import type { TimeZoneOptions } from "../types/options.types.js";
import type { Weekday } from "../types/time.types.js";
import { assertInteger, assertIntegerInRange } from "../utils/assert.utils.js";
import {
    addGregorianDays,
    daysInGregorianMonth,
    isoWeekdayNumber,
} from "../utils/gregorian.utils.js";
import { rangeError } from "../utils/error.utils.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";

/**
 * Returns the start of the nth weekday in a month.
 *
 * `occurrence` `1` is the first and `-1` is the last. The result is
 * `undefined` when that occurrence does not exist, such as a fifth Monday
 * in a short month.
 *
 * @param year - The Gregorian year.
 * @param month - The month, from 1 through 12.
 * @param weekday - ISO weekday, Monday `1` through Sunday `7`.
 * @param occurrence - An integer from 1 through 5, or from -5 through -1.
 * @param options - `timeZone` defaults to the system zone.
 * @returns A new `Date`, or `undefined` when the occurrence does not exist.
 * @throws {@link TypeError} When a number argument is not a number.
 * @throws {@link RangeError} When `month` or `occurrence` is out of range.
 * @example
 * getNthWeekdayOfMonth(2026, 11, 4, 4, { timeZone: "UTC" })?.toISOString(); // "2026-11-26T00:00:00.000Z"
 */
export function getNthWeekdayOfMonth(
    year: number,
    month: number,
    weekday: Weekday,
    occurrence: number,
    options?: TimeZoneOptions,
): Date | undefined {
    const yearNumber = assertInteger(year, "year");
    const monthNumber = assertIntegerInRange(month, "month", 1, 12);
    const weekdayNumber = assertIntegerInRange(weekday, "weekday", 1, 7);
    const occurrenceNumber = assertInteger(occurrence, "occurrence");
    if (
        occurrenceNumber === 0 ||
        occurrenceNumber > 5 ||
        occurrenceNumber < -5
    ) {
        throw rangeError(
            "occurrence",
            "an integer from 1 to 5 or -5 to -1",
            occurrenceNumber,
        );
    }
    const firstWeekday = isoWeekdayNumber(yearNumber, monthNumber, 1);
    const daysUntilFirst = (weekdayNumber - firstWeekday + 7) % 7;
    const firstMatchingDay = 1 + daysUntilFirst;
    const length = daysInGregorianMonth(yearNumber, monthNumber);
    const lastIndex = Math.floor((length - firstMatchingDay) / 7);
    const indexFromStart =
        occurrenceNumber > 0
            ? occurrenceNumber - 1
            : lastIndex + occurrenceNumber + 1;
    const day = firstMatchingDay + indexFromStart * 7;
    if (indexFromStart < 0 || day > length) {
        return undefined;
    }
    const calendar = addGregorianDays(yearNumber, monthNumber, 1, day - 1);
    return new Date(
        instantFromWallTime(
            {
                year: calendar.year,
                month: calendar.month,
                day: calendar.day,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
            resolveTimeZone(options?.timeZone),
            "compatible",
        ),
    );
}
