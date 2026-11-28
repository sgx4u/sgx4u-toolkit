import type { Interval } from "../types/interval.types.js";

/**
 * How touching endpoints are counted.
 */
export interface DoIntervalsOverlapOptions {
    /**
     * When `true`, an endpoint touch counts as overlap.
     *
     * @defaultValue `false`
     */
    countTouchingAsOverlap?: boolean;
}

/**
 * Fields for {@link doIntervalsOverlap}.
 */
export interface DoIntervalsOverlapParams extends DoIntervalsOverlapOptions {
    /**
     * The first interval.
     */
    first: Interval;
    /**
     * The second interval.
     */
    second: Interval;
}
