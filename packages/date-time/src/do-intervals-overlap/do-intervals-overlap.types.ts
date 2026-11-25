/**
 * Whether intervals that only touch count as overlapping.
 */
export interface DoIntervalsOverlapOptions {
    /**
     * Whether `[a, b)` and `[b, c)` overlap.
     *
     * @defaultValue `false`
     */
    countTouchingAsOverlap?: boolean;
}
