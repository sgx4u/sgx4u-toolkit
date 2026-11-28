import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getSortedInsertIndex}.
 */
export interface GetSortedInsertIndexParams<Item> {
    /**
     * A sorted array. The search assumes ascending order and `nulls: "last"`.
     */
    array: readonly Item[];
    /**
     * The value to place. Its key is read the same way as each item's key.
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
