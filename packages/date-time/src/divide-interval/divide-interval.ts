import type { Interval } from "../types/interval.types.js";
import { rangeError } from "../utils/error.utils.js";
import { isIntervalValue } from "../utils/interval.utils.js";
import type { DivideIntervalParams } from "./divide-interval.types.js";

/**
 * Splits an interval into equal parts.
 *
 * Part lengths differ by at most one millisecond. The parts are in order
 * and cover the whole interval.
 *
 * @param params - `interval` and `partCount` are required.
 * @returns The parts, or `undefined` when the interval or `partCount` is not usable.
 * @throws {@link RangeError} When `partCount` is not a positive integer.
 * @example
 * divideInterval({
 *   interval: { start: new Date(0), end: new Date(10) },
 *   partCount: 2,
 * })?.map((part) => part.end.getTime()); // [5, 10]
 */
export function divideInterval({
    interval,
    partCount,
}: DivideIntervalParams): Interval[] | undefined {
    if (!isIntervalValue(interval)) {
        return undefined;
    }
    if (typeof partCount !== "number" || !Number.isInteger(partCount)) {
        return undefined;
    }
    if (partCount < 1) {
        throw rangeError("partCount", "a positive integer", partCount);
    }
    const start = interval.start.getTime();
    const length = interval.end.getTime() - start;
    const base = Math.floor(length / partCount);
    const remainder = length - base * partCount;
    const parts: Interval[] = [];
    let cursor = start;
    for (let index = 0; index < partCount; index += 1) {
        const size = base + (index < remainder ? 1 : 0);
        const next = cursor + size;
        parts.push({ start: new Date(cursor), end: new Date(next) });
        cursor = next;
    }
    return parts;
}
