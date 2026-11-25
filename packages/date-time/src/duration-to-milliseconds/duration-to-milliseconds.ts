import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import { addDuration } from "../add-duration/add-duration.js";
import { assertDuration } from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { resolveDateInput } from "../utils/date-input.utils.js";
import { resolveTimeZone } from "../utils/time-zone.utils.js";

/**
 * Options for measuring a duration in milliseconds.
 */
export interface DurationToMillisecondsOptions extends TimeZoneOptions {
    /**
     * The instant used when the duration contains months or years.
     */
    relativeTo?: DateInput;
}

/**
 * Returns the exact length of a duration in milliseconds.
 *
 * Without `relativeTo`, a day is 24 hours and a week is 7 days. Months or
 * years without `relativeTo` throw.
 *
 * @param duration - The duration to measure.
 * @param options - `relativeTo` is required for months or years.
 * @returns The signed length in milliseconds.
 * @throws {@link RangeError} When months or years are present without `relativeTo`.
 * @example
 * durationToMilliseconds({ hours: 1, minutes: 30 }); // 5400000
 */
export function durationToMilliseconds(
    duration: Duration,
    options?: DurationToMillisecondsOptions,
): number {
    const checked = assertDuration(duration, "duration");
    if (
        ((checked.years ?? 0) !== 0 || (checked.months ?? 0) !== 0) &&
        options?.relativeTo === undefined
    ) {
        throw rangeError(
            "duration",
            "free of months and years, or pass `relativeTo`",
            duration,
        );
    }
    if (options?.relativeTo !== undefined) {
        const timeZone = resolveTimeZone(options.timeZone);
        const start = resolveDateInput(options.relativeTo, "relativeTo", timeZone);
        return addDuration(start, checked, { timeZone }).getTime() - start.getTime();
    }
    return (
        (checked.weeks ?? 0) * 7 * 86_400_000 +
        (checked.days ?? 0) * 86_400_000 +
        (checked.hours ?? 0) * 3_600_000 +
        (checked.minutes ?? 0) * 60_000 +
        (checked.seconds ?? 0) * 1_000 +
        (checked.milliseconds ?? 0)
    );
}
