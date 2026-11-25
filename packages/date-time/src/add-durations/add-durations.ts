import type { Duration } from "../types/duration.types.js";
import {
    assertDuration,
    durationFieldNames,
    isDurationValue,
} from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";

/**
 * Adds two durations field by field.
 *
 * The result must still share one sign. A sum that mixes signs throws.
 *
 * @param first - The first duration.
 * @param second - The second duration.
 * @returns A new duration. Zero fields are omitted.
 * @throws {@link RangeError} When either duration is invalid or the sum mixes signs.
 * @example
 * addDurations({ hours: 1 }, { minutes: 30 }); // { hours: 1, minutes: 30 }
 */
export function addDurations(first: Duration, second: Duration): Duration {
    const left = assertDuration(first, "first");
    const right = assertDuration(second, "second");
    const sum: Duration = {};
    for (const fieldName of durationFieldNames) {
        const total = (left[fieldName] ?? 0) + (right[fieldName] ?? 0);
        if (total !== 0) {
            sum[fieldName] = total;
        }
    }
    if (!isDurationValue(sum)) {
        throw rangeError(
            "first",
            "a duration that can be added to `second`",
            first,
        );
    }
    return sum;
}
