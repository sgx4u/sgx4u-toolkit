import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getSum}.
 */
export interface GetSumParams<Item> {
    /** Values to add. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to add from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
}
