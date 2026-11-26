import type { Duration } from "../types/duration.types.js";
import {
    durationFieldNames,
    isDurationValue,
    readDuration,
} from "../utils/duration.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { AddDurationsParams } from "./add-durations.types.js";

/**
 * Adds two durations field by field.
 *
 * The result must still share one sign. A sum that mixes signs throws.
 *
 * @param params - `first` and `second` are the durations to sum.
 * @returns A new duration with zero fields omitted, or `undefined` when either duration is not usable.
 * @throws {@link RangeError} When the sum mixes signs.
 * @example
 * addDurations({ first: { hours: 1 }, second: { minutes: 30 } }); // { hours: 1, minutes: 30 }
 */
export function addDurations({
    first,
    second,
}: AddDurationsParams): Duration | undefined {
    const left = readDuration(first);
    const right = readDuration(second);
    if (left === undefined || right === undefined) {
        return undefined;
    }
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
