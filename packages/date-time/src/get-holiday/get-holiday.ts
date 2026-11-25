import type { Holiday, HolidayRule } from "../types/holiday.types.js";
import type { DateInput } from "../types/date-input.types.js";
import type { CalendarDate } from "../types/time.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { holidaysInYear } from "../utils/holiday.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { HolidayMatchOptions } from "./get-holiday.types.js";

/**
 * Returns the holiday that falls on a date, if any.
 *
 * Matching uses the calendar day in `timeZone`. By default the observed
 * substitute day matches. The original date matches as well.
 *
 * @param date - The date to test.
 * @param rules - The holiday rules.
 * @param options - `matchObservedDate` defaults to `true`.
 * @returns The holiday, or `undefined` when the day is not a holiday.
 * @throws {@link TypeError} When `rules` is not an array.
 * @example
 * getHoliday("2020-07-03T00:00:00Z", [{ name: "Independence Day", date: { kind: "fixed", month: 7, day: 4 }, observed: "nearest-weekday" }], { timeZone: "UTC" })?.name; // "Independence Day"
 */
export function getHoliday(
    date: DateInput,
    rules: readonly HolidayRule[],
    options?: HolidayMatchOptions,
): Holiday | undefined {
    if (!Array.isArray(rules)) {
        throw typeError("rules", "an array of holiday rules", rules);
    }
    const timeZone = resolveTimeZone(options?.timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", timeZone).getTime(),
        timeZone,
    );
    const calendarDate = {
        year: parts.year,
        month: parts.month,
        day: parts.day,
    };
    const matchObserved = options?.matchObservedDate ?? true;
    return holidaysInYear(parts.year, rules).find(
        (holiday) =>
            sameDate(holiday.date, calendarDate) ||
            (matchObserved && sameDate(holiday.observedDate, calendarDate)),
    );
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
