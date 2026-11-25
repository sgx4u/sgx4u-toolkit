import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type { NowOptions, TimeZoneOptions } from "../types/options.types.js";
import { durationWindow } from "../utils/now.utils.js";

/**
 * Reports whether a date is between now minus a duration and now.
 *
 * Both ends are included. Calendar units in the duration are applied in
 * the zone.
 *
 * @param date - The date to test.
 * @param duration - How far back to look. It must not be negative.
 * @param options - `now` defaults to the current time.
 * @returns `true` when `date` is inside the window.
 * @throws {@link TypeError} When an argument has the wrong type.
 * @throws {@link RangeError} When `duration` is negative or a value is invalid.
 * @example
 * isWithinLast("2025-12-31T12:00:00Z", { days: 1 }, { now: "2026-01-01T00:00:00Z", timeZone: "UTC" }); // true
 */
export function isWithinLast(
    date: DateInput,
    duration: Duration,
    options?: NowOptions & TimeZoneOptions,
): boolean {
    const window = durationWindow(date, duration, options);
    return window.instant >= window.earlier && window.instant <= window.now;
}
