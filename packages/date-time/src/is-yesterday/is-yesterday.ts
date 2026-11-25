import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";
import { isOffsetDay } from "../utils/now.utils.js";

/**
 * Reports whether a date falls on the calendar day before today.
 *
 * @param date - The date to test.
 * @param options - `now` defaults to the current time.
 * @returns `true` when `date` is yesterday in the zone.
 * @throws {@link TypeError} When `date` has the wrong type.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * isYesterday("2026-11-25T00:00:00Z", { now: "2026-11-26T00:00:00Z", timeZone: "UTC" }); // true
 */
export function isYesterday(
    date: DateInput,
    options?: NowOptions & TimeZoneOptions,
): boolean {
    return isOffsetDay(date, -1, options);
}
