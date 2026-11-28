import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Which item to keep when `by` returns a key that is already present.
 */
export type IndexByConflict = "first" | "last" | "throw";

/**
 * Arguments for {@link indexBy}.
 */
export interface IndexByParams<Item> {
    /**
     * Items to index.
     */
    array: readonly Item[];
    /**
     * Property key or function. The record key is `String` of its result.
     */
    by: Iteratee<Item>;
    /**
     * What to do when two items share a string key.
     * @defaultValue "last"
     */
    onConflict?: IndexByConflict;
}
