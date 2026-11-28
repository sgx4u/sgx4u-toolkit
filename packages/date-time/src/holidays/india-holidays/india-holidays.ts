import type { ConfiguredHoliday } from "../../types/configured-holiday.types.js";
import { configuredHolidaysInYear } from "../../utils/holiday.utils.js";
import { indiaHolidayRules } from "../india-holiday-rules/india-holiday-rules.js";

/**
 * National holidays of India for one year, as `{ date, name }`.
 *
 * Pass the result to `holidays` on `createDateTime` or to `isHoliday`.
 * `date` is `YYYY-MM-DD` for the observed day. A year missing from a
 * lunar table omits that holiday. Republic Day, Independence Day, Gandhi
 * Jayanti, Good Friday, and Christmas are present every year.
 *
 * @param year - The Gregorian year.
 * @returns The holidays, or `undefined` when `year` is not an integer.
 * @example
 * indiaHolidays(2026)?.find((holiday) => holiday.name === "Republic Day");
 * // { date: "2026-01-26", name: "Republic Day" }
 */
export function indiaHolidays(year: number): ConfiguredHoliday[] | undefined {
    return configuredHolidaysInYear(year, indiaHolidayRules);
}
