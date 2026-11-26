import type { Holiday } from "../types/holiday.types.js";
import { typeError } from "../utils/error.utils.js";
import { holidaysInYear } from "../utils/holiday.utils.js";
import type { GetHolidaysInYearParams } from "./get-holidays-in-year.types.js";

/**
 * Expands holiday rules for one Gregorian year.
 *
 * Results are sorted by the observed date. A `"year-table"` rule with no
 * entry for the year is skipped. An `"intl-calendar"` rule can match twice
 * when the calendar date occurs twice in the Gregorian year.
 *
 * @param params - `year` and `rules` name what to expand.
 * @returns `{ name, type, date, observedDate }` for each holiday, or `undefined` when `year` is not an integer.
 * @throws {@link TypeError} When `rules` is not an array.
 * @example
 * getHolidaysInYear({ year: 2026, rules: [{ name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } }] }); // [{ name: "Christmas", type: "public", date: { year: 2026, month: 12, day: 25 }, observedDate: { year: 2026, month: 12, day: 25 } }]
 */
export function getHolidaysInYear({
    year,
    rules,
}: GetHolidaysInYearParams): Holiday[] | undefined {
    if (typeof year !== "number" || !Number.isInteger(year)) {
        return undefined;
    }
    if (!Array.isArray(rules)) {
        throw typeError("rules", "an array of holiday rules", rules);
    }
    return holidaysInYear(year, rules);
}