import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getRunningTotals}.
 */
export interface GetRunningTotalsParams<Item> {
    /** Values to accumulate. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to add from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
}
