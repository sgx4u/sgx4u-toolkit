import type { Interval } from "../types/interval.types.js";

/**
 * Fields for {@link mergeIntervals}.
 */
export interface MergeIntervalsParams {
    /**
     * The intervals to combine.
     */
    intervals: readonly Interval[];
    /**
     * Whether `[a, b)` and `[b, c)` become one interval.
     *
     * @defaultValue `true`
     */
    mergeTouching?: boolean;
}