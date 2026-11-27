import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getMean}.
 */
export interface GetMeanParams<Item> {
    /** Values to average. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to average from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
}
