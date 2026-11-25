import type { Holiday, HolidayRule } from "../types/holiday.types.js";
import type { CalendarDate } from "../types/time.types.js";
import { holidaysInYear } from "../utils/holiday.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import { typeError } from "../utils/error.utils.js";
import type { HolidayMatchOptions } from "../get-holiday/get-holiday.types.js";

/**
 * Builds a holiday predicate that caches each year the first time it is asked.
 *
 * The predicate is suitable for `BusinessCalendar.holidays`. It reads the
 * calendar day in `timeZone`.
 *
 * @param rules - The holiday rules.
 * @param options - `matchObservedDate` defaults to `true`.
 * @returns A function from a `Date` to whether that day is a holiday.
 * @throws {@link TypeError} When `rules` is not an array.
 * @example
 * const isIndianHoliday = createHolidayPredicate([{ name: "Republic Day", date: { kind: "fixed", month: 1, day: 26 } }], { timeZone: "Asia/Kolkata" });
 * isIndianHoliday(new Date("2026-01-25T18:30:00Z")); // true
 */
export function createHolidayPredicate(
    rules: readonly HolidayRule[],
    options?: HolidayMatchOptions,
): (date: Date) => boolean {
    if (!Array.isArray(rules)) {
        throw typeError("rules", "an array of holiday rules", rules);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const matchObserved = options?.matchObservedDate ?? true;
    const cache = new Map<number, Holiday[]>();
    return (date) => {
        const parts = readDateParts(date.getTime(), timeZone);
        let yearHolidays = cache.get(parts.year);
        if (yearHolidays === undefined) {
            yearHolidays = holidaysInYear(parts.year, rules);
            cache.set(parts.year, yearHolidays);
        }
        const calendarDate = {
            year: parts.year,
            month: parts.month,
            day: parts.day,
        };
        return yearHolidays.some(
            (holiday) =>
                sameDate(holiday.date, calendarDate) ||
                (matchObserved && sameDate(holiday.observedDate, calendarDate)),
        );
    };
}

/**
 * @param first - A calendar date.
 * @param second - Another calendar date.
 * @returns `true` when the year, month, and day match.
 */
function sameDate(first: CalendarDate, second: CalendarDate): boolean {
    return (
        first.year === second.year &&
        first.month === second.month &&
        first.day === second.day
    );
}
