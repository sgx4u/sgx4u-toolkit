import type { Interval } from "../types/interval.types.js";

/**
 * Fields for {@link divideInterval}.
 */
export interface DivideIntervalParams {
    /**
     * The interval to divide.
     */
    interval: Interval;
    /**
     * How many parts to make. It must be a positive integer.
     */
    partCount: number;
}
