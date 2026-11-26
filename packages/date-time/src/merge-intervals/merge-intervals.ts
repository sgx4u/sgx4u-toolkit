import type { Interval } from "../types/interval.types.js";
import { mergeIntervalList } from "../utils/interval.utils.js";
import type { MergeIntervalsParams } from "./merge-intervals.types.js";

/**
 * Returns the sorted union of intervals, with overlaps joined.
 *
 * The input array is not reordered. Empty intervals are kept only when
 * they do not fall inside another interval.
 *
 * @param params - `intervals` is required. `mergeTouching` defaults to `true`.
 * @returns New intervals sorted by start, or `undefined` when `intervals` is not an array.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * mergeIntervals({
 *   intervals: [
 *     { start: new Date(0), end: new Date(10) },
 *     { start: new Date(10), end: new Date(20) },
 *   ],
 * })?.length; // 1
 */
export function mergeIntervals({
    intervals,
    mergeTouching = true,
}: MergeIntervalsParams): Interval[] | undefined {
    if (!Array.isArray(intervals)) {
        return undefined;
    }
    return mergeIntervalList(intervals, mergeTouching);
}