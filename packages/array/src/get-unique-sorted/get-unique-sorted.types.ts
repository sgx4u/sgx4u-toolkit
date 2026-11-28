import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getUniqueSorted}.
 */
export interface GetUniqueSortedParams<Item> {
    /**
     * An array that is already sorted by the same key.
     */
    array: readonly Item[];
    /**
     * Property key or function. Omit it to compare the items themselves.
     * Adjacent keys are compared with SameValueZero.
     */
    by?: Iteratee<Item>;
}
