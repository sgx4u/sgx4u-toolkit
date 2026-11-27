import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link groupByKeys}.
 */
export interface GroupByKeysParams<Item> {
    /**
     * Items to group.
     */
    array: readonly Item[];
    /**
     * One iteratee per nesting level, from the outside inward.
     */
    keys: readonly Iteratee<Item>[];
}
