import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link partitionBy}.
 */
export interface PartitionByParams<Item> {
    /**
     * Items to place into the first matching bucket.
     */
    array: readonly Item[];
    /**
     * Predicates, tested from left to right.
     */
    predicates: readonly Predicate<Item>[];
}
