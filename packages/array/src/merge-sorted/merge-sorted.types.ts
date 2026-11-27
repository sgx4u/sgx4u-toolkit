import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link mergeSorted}.
 */
export interface MergeSortedParams<Item> {
    /**
     * The first sorted array. On a tie, its item is taken first.
     */
    first: readonly Item[];
    /**
     * The second sorted array.
     */
    second: readonly Item[];
    /**
     * Property key or function. Omit it to compare the items themselves.
     * @defaultValue the item
     */
    by?: Iteratee<Item>;
    /**
     * BCP 47 language tag or list. Use the locale both arrays were sorted with.
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * When true, number-like parts of strings compare as numbers.
     * @defaultValue false
     */
    numeric?: boolean;
}
