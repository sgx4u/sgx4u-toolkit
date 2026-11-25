import type { Duration } from "../types/duration.types.js";
import { assertDuration, negatedDuration } from "../utils/duration.utils.js";

/**
 * Returns a duration with every field's sign flipped.
 *
 * Zero fields stay zero. The input is not changed.
 *
 * @param duration - The duration to negate.
 * @returns A new duration.
 * @throws {@link RangeError} When `duration` is not a valid duration.
 * @example
 * negateDuration({ hours: 2 }); // { hours: -2 }
 */
export function negateDuration(duration: Duration): Duration {
    return negatedDuration(assertDuration(duration, "duration"));
}
