import type { Iteratee } from "../types/iteratee.types.js";
import type { UniqueKeep } from "../get-unique-items/get-unique-items.types.js";

/**
 * Arguments for {@link getUniqueItemsBy}.
 */
export interface GetUniqueItemsByParams<Item> {
    /**
     * Items to scan from left to right.
     */
    array: readonly Item[];
    /**
     * Property key or function. Uniqueness uses SameValueZero on its result.
     */
    by: Iteratee<Item>;
    /**
     * Which occurrence to keep.
     * @defaultValue "first"
     */
    keep?: UniqueKeep;
}
