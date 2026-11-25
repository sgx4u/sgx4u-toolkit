import type { Interval } from "../types/interval.types.js";
import { assertInteger } from "../utils/assert.utils.js";
import { rangeError } from "../utils/error.utils.js";
import { readInterval } from "../utils/interval.utils.js";

/**
 * Splits an interval into equal parts.
 *
 * Part lengths differ by at most one millisecond. The parts are in order
 * and cover the whole interval.
 *
 * @param interval - The interval to divide.
 * @param partCount - How many parts to make. It must be a positive integer.
 * @returns The parts.
 * @throws {@link TypeError} When `partCount` is not a number.
 * @throws {@link RangeError} When `partCount` is not a positive integer or the interval is invalid.
 * @example
 * divideInterval({ start: new Date(0), end: new Date(10) }, 2).map((part) => part.end.getTime()); // [5, 10]
 */
export function divideInterval(interval: Interval, partCount: number): Interval[] {
    const checked = readInterval(interval);
    const count = assertInteger(partCount, "partCount");
    if (count < 1) {
        throw rangeError("partCount", "a positive integer", partCount);
    }
    const start = checked.start.getTime();
    const length = checked.end.getTime() - start;
    const base = Math.floor(length / count);
    const remainder = length - base * count;
    const parts: Interval[] = [];
    let cursor = start;
    for (let index = 0; index < count; index += 1) {
        const size = base + (index < remainder ? 1 : 0);
        const next = cursor + size;
        parts.push({ start: new Date(cursor), end: new Date(next) });
        cursor = next;
    }
    return parts;
}
