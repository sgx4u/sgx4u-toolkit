import type { Duration } from "../types/duration.types.js";
import { assertFiniteNumber } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";
import type { MillisecondsToDurationOptions } from "./milliseconds-to-duration.types.js";

const unitSizes: Readonly<Record<string, number>> = {
    week: 7 * 86_400_000,
    day: 86_400_000,
    hour: 3_600_000,
    minute: 60_000,
    second: 1_000,
    millisecond: 1,
};

const fieldNames: Readonly<Record<string, keyof Duration>> = {
    week: "weeks",
    day: "days",
    hour: "hours",
    minute: "minutes",
    second: "seconds",
    millisecond: "milliseconds",
};

const order = ["week", "day", "hour", "minute", "second", "millisecond"] as const;

/**
 * Splits a millisecond length into duration fields.
 *
 * @param milliseconds - The signed length.
 * @param options - `largestUnit` defaults to `"day"` and `smallestUnit` to `"millisecond"`.
 * @returns The duration. Zero fields are omitted.
 * @throws {@link TypeError} When `milliseconds` is not a number.
 * @throws {@link RangeError} When a unit is unknown or `smallestUnit` is larger than `largestUnit`.
 * @example
 * millisecondsToDuration(5_400_000); // { hours: 1, minutes: 30 }
 */
export function millisecondsToDuration(
    milliseconds: number,
    options?: MillisecondsToDurationOptions,
): Duration {
    const value = assertFiniteNumber(milliseconds, "milliseconds");
    const largest = options?.largestUnit ?? "day";
    const smallest = options?.smallestUnit ?? "millisecond";
    const largestIndex = order.indexOf(largest);
    const smallestIndex = order.indexOf(smallest);
    if (largestIndex < 0) {
        throw rangeError("largestUnit", "week, day, or a clock unit", largest);
    }
    if (smallestIndex < 0) {
        throw rangeError("smallestUnit", "a clock unit", smallest);
    }
    if (smallestIndex < largestIndex) {
        throw rangeError("smallestUnit", `a unit no larger than \`${largest}\``, smallest);
    }
    const sign = value < 0 ? -1 : 1;
    let remaining = Math.abs(value);
    const duration: Duration = {};
    for (let index = largestIndex; index <= smallestIndex; index += 1) {
        const unit = order[index];
        if (unit === undefined) {
            continue;
        }
        const size = unitSizes[unit] ?? 1;
        const field = fieldNames[unit];
        if (field === undefined) {
            continue;
        }
        if (index === smallestIndex) {
            const amount = (sign * remaining) / size;
            if (amount !== 0) {
                duration[field] = amount;
            }
            break;
        }
        const count = Math.floor(remaining / size);
        remaining -= count * size;
        if (count !== 0) {
            duration[field] = sign * count;
        }
    }
    return duration;
}
