import type { Interval } from "../types/interval.types.js";
import { intersectionOf, readInterval } from "../utils/interval.utils.js";

/**
 * Returns the shared part of two intervals.
 *
 * @param first - The first interval.
 * @param second - The second interval.
 * @returns The overlap, or `undefined` when there is none.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * getIntervalIntersection(
 *   { start: new Date(0), end: new Date(10) },
 *   { start: new Date(5), end: new Date(15) },
 * )?.start.getTime(); // 5
 */
export function getIntervalIntersection(
    first: Interval,
    second: Interval,
): Interval | undefined {
    return intersectionOf(
        readInterval(first, "first"),
        readInterval(second, "second"),
    );
}
