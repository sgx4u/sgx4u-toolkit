import { stepToWeekday } from "../get-next-weekday/get-next-weekday.js";
import type { GetNextWeekdayParams } from "../get-next-weekday/get-next-weekday.types.js";

/**
 * Returns the start of the previous day that falls on `weekday`.
 *
 * @param params - `date` and `weekday` are required. `includeCurrentDay` defaults to `false`.
 * @returns A new `Date` at the start of that day in the zone, or `undefined` when `date` is not usable.
 * @throws {@link RangeError} When `weekday` is outside 1 through 7 or `timeZone` is invalid.
 * @example
 * getPreviousWeekday({
 *   date: "2026-11-26T15:00:00Z",
 *   weekday: 1,
 *   timeZone: "UTC",
 * })?.toISOString(); // "2026-11-23T00:00:00.000Z"
 */
export function getPreviousWeekday(
    params: GetNextWeekdayParams,
): Date | undefined {
    return stepToWeekday(params, -1);
}