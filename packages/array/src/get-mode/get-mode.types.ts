import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getMode}.
 */
export interface GetModeParams<Item> {
    /** Items to count. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the key whose frequency is counted.
     *
     * When omitted, the items themselves are counted. Keys use SameValueZero.
     * The result is still the first item of each maximal key.
     */
    by?: Iteratee<Item>;
}
