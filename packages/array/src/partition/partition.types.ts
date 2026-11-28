import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link partition}.
 */
export interface PartitionParams<Item> {
    /**
     * Items to split.
     */
    array: readonly Item[];
    /**
     * Function that chooses the first bucket.
     */
    predicate: Predicate<Item>;
}
