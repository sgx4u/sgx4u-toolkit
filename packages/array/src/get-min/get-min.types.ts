import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getMin} when the caller passes an object.
 *
 * A bare array is also accepted. It is treated as `{ array }`.
 */
export interface GetMinParams<Item> {
    /** Items to compare. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to compare from one item.
     *
     * When omitted, the items themselves are compared with `<`.
     */
    by?: Iteratee<Item, number>;
}
