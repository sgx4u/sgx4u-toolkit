import type { Interval } from "../types/interval.types.js";
import { intervalsOverlap, readInterval } from "../utils/interval.utils.js";
import type { DoIntervalsOverlapOptions } from "./do-intervals-overlap.types.js";

/**
 * Reports whether two half-open intervals overlap.
 *
 * By default, intervals that only touch at an endpoint do not overlap.
 *
 * @param first - The first interval.
 * @param second - The second interval.
 * @param options - `countTouchingAsOverlap` defaults to `false`.
 * @returns `true` when the intervals overlap.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * doIntervalsOverlap(
 *   { start: new Date(0), end: new Date(10) },
 *   { start: new Date(10), end: new Date(20) },
 * ); // false
 */
export function doIntervalsOverlap(
    first: Interval,
    second: Interval,
    options?: DoIntervalsOverlapOptions,
): boolean {
    return intervalsOverlap(
        readInterval(first, "first"),
        readInterval(second, "second"),
        options?.countTouchingAsOverlap ?? false,
    );
}
