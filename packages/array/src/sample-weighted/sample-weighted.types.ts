import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link sampleWeighted}.
 */
export interface SampleWeightedParams<Item> {
    /** Items to draw from. The array is not mutated. */
    array: readonly Item[];
    /**
     * Weight of one item.
     *
     * A property key or a function. The result must be a finite number
     * greater than or equal to 0. A weight of 0 is never drawn.
     */
    weight: Iteratee<Item, number>;
    /**
     * How many items to draw.
     * @defaultValue 1
     */
    count?: number;
    /**
     * When true, a drawn item keeps its weight and can be drawn again.
     * @defaultValue false
     */
    replacement?: boolean;
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
