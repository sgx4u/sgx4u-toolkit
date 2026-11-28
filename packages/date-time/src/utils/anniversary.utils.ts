import type { LeapDayBirthday } from "../get-age/get-age.types.js";
import type { CalendarDate } from "../types/time.types.js";
import { isGregorianLeapYear } from "./gregorian.utils.js";

/**
 * The anniversary calendar date in `year`.
 *
 * A February 29 birthday falls on March 1 in a common year unless the
 * policy says February 28.
 *
 * @param birth - The original month and day.
 * @param year - The year of the anniversary.
 * @param leapDayBirthday - Where a leap-day birthday lands in a common year.
 * @returns The calendar date of that anniversary.
 */
export function anniversaryDate(
    birth: CalendarDate,
    year: number,
    leapDayBirthday: LeapDayBirthday,
): CalendarDate {
    if (birth.month === 2 && birth.day === 29 && !isGregorianLeapYear(year)) {
        if (leapDayBirthday === "february-28") {
            return { year, month: 2, day: 28 };
        }
        return { year, month: 3, day: 1 };
    }
    return { year, month: birth.month, day: birth.day };
}

/**
 * @param left - A calendar date.
 * @param right - A calendar date.
 * @returns Negative when `left` is before `right`.
 */
export function compareCalendarDates(
    left: CalendarDate,
    right: CalendarDate,
): number {
    if (left.year !== right.year) {
        return left.year - right.year;
    }
    if (left.month !== right.month) {
        return left.month - right.month;
    }
    return left.day - right.day;
}
