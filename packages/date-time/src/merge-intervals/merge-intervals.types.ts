/**
 * Whether touching intervals are joined.
 */
export interface MergeIntervalsOptions {
    /**
     * Whether `[a, b)` and `[b, c)` become one interval.
     *
     * @defaultValue `true`
     */
    mergeTouching?: boolean;
}
