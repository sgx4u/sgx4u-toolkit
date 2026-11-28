import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getProduct}.
 */
export interface GetProductParams<Item> {
    /** Values to multiply. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to multiply from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
}
