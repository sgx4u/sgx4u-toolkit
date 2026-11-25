import type { HolidayRule } from "../types/holiday.types.js";
import type { DateInput } from "../types/date-input.types.js";
import { getHoliday } from "../get-holiday/get-holiday.js";
import type { HolidayMatchOptions } from "../get-holiday/get-holiday.types.js";

/**
 * Reports whether a holiday rule falls on a date.
 *
 * @param date - The date to test.
 * @param rules - The holiday rules.
 * @param options - `matchObservedDate` defaults to `true`.
 * @returns `true` when `getHoliday` finds a holiday.
 * @throws {@link TypeError} When `rules` is not an array.
 * @example
 * isHoliday("2026-12-25T00:00:00Z", [{ name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } }], { timeZone: "UTC" }); // true
 */
export function isHoliday(
    date: DateInput,
    rules: readonly HolidayRule[],
    options?: HolidayMatchOptions,
): boolean {
    return getHoliday(date, rules, options) !== undefined;
}
