import type { Interval } from "../types/interval.types.js";

/**
 * Fields for {@link getIntervalGaps}.
 */
export interface GetIntervalGapsParams {
    /**
     * The covered intervals.
     */
    intervals: readonly Interval[];
    /**
     * An optional window to measure inside.
     */
    within?: Interval;
}