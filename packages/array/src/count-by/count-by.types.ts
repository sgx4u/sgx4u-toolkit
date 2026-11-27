import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link countBy}.
 */
export interface CountByParams<Item> {
    /**
     * Items to count.
     */
    array: readonly Item[];
    /**
     * Property key or function that chooses the bucket.
     */
    by: Iteratee<Item>;
}
