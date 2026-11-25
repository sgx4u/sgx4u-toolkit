import type { Holiday, HolidayRule } from "../types/holiday.types.js";
import { assertInteger } from "../utils/assert.utils.js";
import { typeError } from "../utils/error.utils.js";
import { holidaysInYear } from "../utils/holiday.utils.js";

/**
 * Expands holiday rules for one Gregorian year.
 *
 * Results are sorted by the observed date. A `"year-table"` rule with no
 * entry for the year is skipped. An `"intl-calendar"` rule can match twice
 * when the calendar date occurs twice in the Gregorian year.
 *
 * @param year - The Gregorian year.
 * @param rules - The rules to expand.
 * @returns `{ name, type, date, observedDate }` for each holiday.
 * @throws {@link TypeError} When `rules` is not an array.
 * @example
 * getHolidaysInYear(2026, [{ name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } }]); // [{ name: "Christmas", type: "public", date: { year: 2026, month: 12, day: 25 }, observedDate: { year: 2026, month: 12, day: 25 } }]
 */
export function getHolidaysInYear(
    year: number,
    rules: readonly HolidayRule[],
): Holiday[] {
    const yearNumber = assertInteger(year, "year");
    if (!Array.isArray(rules)) {
        throw typeError("rules", "an array of holiday rules", rules);
    }
    return holidaysInYear(yearNumber, rules);
}
