import type { Duration } from "../types/duration.types.js";
import { readDuration, negatedDuration } from "../utils/duration.utils.js";

/**
 * Returns a duration with every field's sign flipped.
 *
 * Zero fields stay zero. The input is not changed.
 *
 * @param duration - The duration to negate.
 * @returns A new duration, or `undefined` when `duration` is not usable.
 * @example
 * negateDuration({ hours: 2 }); // { hours: -2 }
 */
export function negateDuration(duration: Duration): Duration | undefined {
    const checked = readDuration(duration);
    if (checked === undefined) {
        return undefined;
    }
    return negatedDuration(checked);
}
