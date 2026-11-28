import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link findIndexes}.
 */
export interface FindIndexesParams<Item> {
    /** Array to scan. */
    array: readonly Item[];

    /**
     * Reports whether the item's index should be kept.
     *
     * Called as `predicate(item, index, array)`. A hole is passed as
     * `undefined`.
     */
    predicate: Predicate<Item>;
}
