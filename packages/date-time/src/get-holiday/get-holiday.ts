import type { Holiday } from "../types/holiday.types.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { typeError } from "../utils/error.utils.js";
import { holidaysInYear } from "../utils/holiday.utils.js";
import { readDateParts, resolveTimeZone } from "../utils/time-zone.utils.js";
import type { CalendarDate } from "../types/time.types.js";
import type { GetHolidayParams } from "./get-holiday.types.js";

/**
 * Returns the holiday that falls on a date, if any.
 *
 * Matching uses the calendar day in `timeZone`. By default the observed
 * substitute day matches. The original date matches as well.
 *
 * @param params - `rules` are holiday rules; `matchObservedDate` defaults to `true`.
 * @returns The holiday, or `undefined` when the day is not a holiday.
 * @throws {@link TypeError} When `rules` is not an array.
 * @throws {@link RangeError} When `date` is not a real date, or `timeZone` is not usable.
 * @example
 * getHoliday({ date: "2020-07-03T00:00:00Z", rules: [{ name: "Independence Day", date: { kind: "fixed", month: 7, day: 4 }, observed: "nearest-weekday" }], timeZone: "UTC" })?.name; // "Independence Day"
 */
export function getHoliday({
    date,
    rules,
    timeZone,
    matchObservedDate = true,
}: GetHolidayParams): Holiday | undefined {
    if (!Array.isArray(rules)) {
        throw typeError("rules", "an array of holiday rules", rules);
    }
    const zone = resolveTimeZone(timeZone);
    const parts = readDateParts(
        resolveDateInput(date, "date", zone).getTime(),
        zone,
    );
    const calendarDate = {
        year: parts.year,
        month: parts.month,
        day: parts.day,
    };
    return holidaysInYear(parts.year, rules).find(
        (holiday) =>
            sameDate(holiday.date, calendarDate) ||
            (matchObservedDate &&
                sameDate(holiday.observedDate, calendarDate)),
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