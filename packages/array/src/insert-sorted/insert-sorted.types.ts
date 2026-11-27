import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link insertSorted}.
 */
export interface InsertSortedParams<Item> {
    /**
     * A sorted array. The insertion assumes ascending order and `nulls: "last"`.
     */
    array: readonly Item[];
    /**
     * The value to insert. Its key is read the same way as each item's key.
     */
    value: Item;
    /**
     * Property key or function. Omit it to compare the items themselves.
     * @defaultValue the item
     */
    by?: Iteratee<Item>;
    /**
     * BCP 47 language tag or list. Use the same locale the array was sorted with.
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * When true, number-like parts of strings compare as numbers.
     * @defaultValue false
     */
    numeric?: boolean;
}
