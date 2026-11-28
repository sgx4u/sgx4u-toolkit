import type { ConfiguredHoliday } from "../../types/configured-holiday.types.js";
import { configuredHolidaysInYear } from "../../utils/holiday.utils.js";
import { unitedKingdomHolidayRules } from "../united-kingdom-holiday-rules/united-kingdom-holiday-rules.js";

/**
 * England and Wales bank holidays for one year, as `{ date, name }`.
 *
 * `date` is the observed weekday. A weekend holiday moves to the next
 * weekday, and moves again when that day is already a holiday.
 *
 * @param year - The Gregorian year.
 * @returns The holidays, or `undefined` when `year` is not an integer.
 * @example
 * unitedKingdomHolidays(2026)?.find((holiday) => holiday.name === "Christmas Day");
 */
export function unitedKingdomHolidays(
    year: number,
): ConfiguredHoliday[] | undefined {
    return configuredHolidaysInYear(year, unitedKingdomHolidayRules);
}
