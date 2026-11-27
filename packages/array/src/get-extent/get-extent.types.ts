import type { Iteratee } from "../types/iteratee.types.js";

/**
 * The first minimum and the first maximum.
 */
export interface Extent<Item> {
    /** The earliest strictly smallest item. */
    min: Item;
    /** The earliest strictly largest item. */
    max: Item;
}

/**
 * Arguments for {@link getExtent}.
 */
export interface GetExtentParams<Item> {
    /** Items to compare. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to compare from one item.
     *
     * When omitted, the items themselves are compared with `<` and `>`.
     */
    by?: Iteratee<Item, number>;
}
