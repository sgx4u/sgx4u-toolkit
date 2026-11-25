import type { Interval } from "../types/interval.types.js";
import { typeError } from "../utils/error.utils.js";
import { mergeIntervalList } from "../utils/interval.utils.js";
import type { MergeIntervalsOptions } from "./merge-intervals.types.js";

/**
 * Returns the sorted union of intervals, with overlaps joined.
 *
 * The input array is not reordered. Empty intervals are kept only when
 * they do not fall inside another interval.
 *
 * @param intervals - The intervals to combine.
 * @param options - `mergeTouching` defaults to `true`.
 * @returns New intervals sorted by start.
 * @throws {@link TypeError} When `intervals` is not an array.
 * @throws {@link RangeError} When an interval is invalid.
 * @example
 * mergeIntervals([
 *   { start: new Date(0), end: new Date(10) },
 *   { start: new Date(10), end: new Date(20) },
 * ]).length; // 1
 */
export function mergeIntervals(
    intervals: readonly Interval[],
    options?: MergeIntervalsOptions,
): Interval[] {
    if (!Array.isArray(intervals)) {
        throw typeError("intervals", "an array of intervals", intervals);
    }
    return mergeIntervalList(intervals, options?.mergeTouching ?? true);
}
