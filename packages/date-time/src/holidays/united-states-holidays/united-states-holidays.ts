import type { ConfiguredHoliday } from "../../types/configured-holiday.types.js";
import { configuredHolidaysInYear } from "../../utils/holiday.utils.js";
import { unitedStatesHolidayRules } from "../united-states-holiday-rules/united-states-holiday-rules.js";

/**
 * United States federal holidays for one year, as `{ date, name }`.
 *
 * `date` is the observed weekday from 5 U.S.C. § 6103: Saturday moves to
 * Friday and Sunday moves to Monday.
 *
 * @param year - The Gregorian year.
 * @returns The holidays, or `undefined` when `year` is not an integer.
 * @example
 * unitedStatesHolidays(2026)?.find((holiday) => holiday.name === "Independence Day");
 * // { date: "2026-07-03", name: "Independence Day" }
 */
export function unitedStatesHolidays(
    year: number,
): ConfiguredHoliday[] | undefined {
    return configuredHolidaysInYear(year, unitedStatesHolidayRules);
}
