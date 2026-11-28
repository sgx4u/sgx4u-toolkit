import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getMedian}.
 */
export interface GetMedianParams<Item> {
    /** Values to rank. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to rank from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
}
