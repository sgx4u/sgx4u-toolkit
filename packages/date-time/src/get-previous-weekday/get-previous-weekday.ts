import type { DateInput } from "../types/date-input.types.js";
import type { Weekday } from "../types/time.types.js";
import { stepToWeekday } from "../get-next-weekday/get-next-weekday.js";
import type { WeekdayStepOptions } from "../get-next-weekday/get-next-weekday.types.js";

/**
 * Returns the start of the previous day that falls on `weekday`.
 *
 * @param date - The date to step from.
 * @param weekday - ISO weekday, Monday `1` through Sunday `7`.
 * @param options - `includeCurrentDay` defaults to `false`.
 * @returns A new `Date` at the start of that day in the zone.
 * @throws {@link TypeError} When `date` or `weekday` has the wrong type.
 * @throws {@link RangeError} When a value is invalid.
 * @example
 * getPreviousWeekday("2026-11-26T15:00:00Z", 1, { timeZone: "UTC" }).toISOString(); // "2026-11-23T00:00:00.000Z"
 */
export function getPreviousWeekday(
    date: DateInput,
    weekday: Weekday,
    options?: WeekdayStepOptions,
): Date {
    return stepToWeekday(date, weekday, options, -1);
}
