import { intervalsOverlap, isIntervalValue } from "../utils/interval.utils.js";
import type { DoIntervalsOverlapParams } from "./do-intervals-overlap.types.js";

/**
 * Reports whether two half-open intervals overlap.
 *
 * By default, intervals that only touch at an endpoint do not overlap.
 *
 * @param params - `first` and `second` are required. `countTouchingAsOverlap` defaults to `false`.
 * @returns `true` when the intervals overlap, or `undefined` when either interval is not usable.
 * @example
 * doIntervalsOverlap({
 *   first: { start: new Date(0), end: new Date(10) },
 *   second: { start: new Date(10), end: new Date(20) },
 * }); // false
 */
export function doIntervalsOverlap({
    first,
    second,
    countTouchingAsOverlap = false,
}: DoIntervalsOverlapParams): boolean | undefined {
    if (!isIntervalValue(first) || !isIntervalValue(second)) {
        return undefined;
    }
    return intervalsOverlap(first, second, countTouchingAsOverlap);
}
