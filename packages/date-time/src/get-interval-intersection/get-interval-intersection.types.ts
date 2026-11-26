import type { Interval } from "../types/interval.types.js";

/**
 * Fields for {@link getIntervalIntersection}.
 */
export interface GetIntervalIntersectionParams {
    /**
     * The first interval.
     */
    first: Interval;
    /**
     * The second interval.
     */
    second: Interval;
}