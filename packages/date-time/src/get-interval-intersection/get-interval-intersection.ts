import type { Interval } from "../types/interval.types.js";
import { intersectionOf, readInterval } from "../utils/interval.utils.js";
import type { GetIntervalIntersectionParams } from "./get-interval-intersection.types.js";

/**
 * Returns the shared part of two intervals.
 *
 * @param params - `first` and `second` are the intervals to compare.
 * @returns The overlap, or `undefined` when there is none.
 * @throws {@link TypeError} When an interval has the wrong shape.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * getIntervalIntersection({
 *   first: { start: new Date(0), end: new Date(10) },
 *   second: { start: new Date(5), end: new Date(15) },
 * })?.start.getTime(); // 5
 */
export function getIntervalIntersection({
    first,
    second,
}: GetIntervalIntersectionParams): Interval | undefined {
    return intersectionOf(
        readInterval(first, "first"),
        readInterval(second, "second"),
    );
}
