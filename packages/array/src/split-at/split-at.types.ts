/**
 * Arguments for {@link splitAt}.
 */
export interface SplitAtParams<Item> {
    /** Array to split. */
    array: readonly Item[];

    /**
     * Index where the right side starts.
     *
     * A negative index counts from the end. The index is clamped into
     * `0..length`, so an index past either end does not throw. A finite
     * non-integer is truncated toward zero. `NaN` and infinities throw.
     * `length` puts every item on the left.
     */
    index: number;
}
