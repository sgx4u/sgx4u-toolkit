/**
 * Arguments for {@link shuffleItems} when the caller passes an object.
 *
 * A bare array is also accepted. It is treated as `{ array }`.
 */
export interface ShuffleItemsParams<Item> {
    /** Items to reorder. The array is not mutated. */
    array: readonly Item[];
    /**
     * Source of numbers in `[0, 1)`.
     *
     * Ignored when `seed` is a finite number.
     * @defaultValue Math.random
     */
    random?: () => number;
    /**
     * Finite seed for a deterministic shuffle.
     *
     * A finite seed wins over `random`.
     */
    seed?: number;
}
