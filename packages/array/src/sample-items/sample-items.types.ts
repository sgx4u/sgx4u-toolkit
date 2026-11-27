/**
 * Arguments for {@link sampleItems}.
 */
export interface SampleItemsParams<Item> {
    /** Items to draw from. The array is not mutated. */
    array: readonly Item[];
    /**
     * How many distinct items to draw.
     *
     * `0` returns an empty array. A count above the array length throws.
     */
    count: number;
    /**
     * Source of numbers in `[0, 1)`.
     *
     * Ignored when `seed` is a finite number.
     * @defaultValue Math.random
     */
    random?: () => number;
    /**
     * Finite seed for a deterministic sample.
     *
     * A finite seed wins over `random`.
     */
    seed?: number;
}
