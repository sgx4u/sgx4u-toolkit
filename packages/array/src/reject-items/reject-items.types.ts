import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link rejectItems}.
 */
export interface RejectItemsParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * Reports whether an item should be dropped.
     *
     * Called as `predicate(item, index, array)`. An item is kept when the
     * result is falsy. A hole is passed as `undefined`.
     */
    predicate: Predicate<Item>;
}
