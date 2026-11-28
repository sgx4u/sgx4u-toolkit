/**
 * Arguments for {@link sampleItem} when the caller passes an object.
 *
 * A bare array is also accepted. It is treated as `{ array }`.
 */
export interface SampleItemParams<Item> {
    /** Items to draw from. The array is not mutated. */
    array: readonly Item[];
    /**
     * Source of numbers in `[0, 1)`.
     *
     * Ignored when `seed` is a finite number.
     * @defaultValue Math.random
     */
    random?: () => number;
    /**
     * Finite seed for a deterministic draw.
     *
     * A finite seed wins over `random`.
     */
    seed?: number;
}
