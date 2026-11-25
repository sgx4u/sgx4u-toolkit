import type { Duration } from "../types/duration.types.js";
import {
    durationToMilliseconds,
    type DurationToMillisecondsOptions,
} from "../duration-to-milliseconds/duration-to-milliseconds.js";

/**
 * Compares two durations by their length.
 *
 * Months and years need `relativeTo`, because their length depends on the
 * calendar.
 *
 * @param first - The first duration.
 * @param second - The second duration.
 * @param options - `relativeTo` is required when either duration has months or years.
 * @returns `-1`, `0`, or `1`.
 * @throws {@link RangeError} When a duration is invalid or a calendar unit has no `relativeTo`.
 * @example
 * compareDurations({ hours: 2 }, { minutes: 90 }); // 1
 */
export function compareDurations(
    first: Duration,
    second: Duration,
    options?: DurationToMillisecondsOptions,
): -1 | 0 | 1 {
    const left = durationToMilliseconds(first, options);
    const right = durationToMilliseconds(second, options);
    if (left < right) {
        return -1;
    }
    if (left > right) {
        return 1;
    }
    return 0;
}
