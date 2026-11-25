import type { DateInput } from "../types/date-input.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";
import { isOffsetDay } from "../utils/now.utils.js";

/**
 * Reports whether a date falls on today's calendar day in a time zone.
 *
 * @param date - The date to test.
 * @param options - `now` defaults to the current time. `timeZone` defaults to the system zone.
 * @returns `true` when the calendar days match.
 * @throws {@link TypeError} When `date` has the wrong type.
 * @throws {@link RangeError} When `date` is not a real date.
 * @example
 * isToday("2026-11-26T23:00:00Z", { now: "2026-11-26T01:00:00Z", timeZone: "UTC" }); // true
 */
export function isToday(
    date: DateInput,
    options?: NowOptions & TimeZoneOptions,
): boolean {
    return isOffsetDay(date, 0, options);
}
