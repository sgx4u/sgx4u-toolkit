/**
 * A half-open range of instants, `[start, end)`.
 *
 * `start` equal to `end` is an empty interval and is valid. `end` before
 * `start` is not.
 */
export interface Interval {
    start: Date;
    end: Date;
}
