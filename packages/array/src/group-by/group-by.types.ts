import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link groupBy}.
 */
export interface GroupByParams<Item> {
    /**
     * Items to group.
     */
    array: readonly Item[];
    /**
     * Property key or function that chooses the group.
     */
    by: Iteratee<Item>;
    /**
     * When `true`, the result is a `Map` keyed by the original `by` result.
     * Otherwise the result is a record keyed by `String(key)`.
     * @defaultValue false
     */
    asMap?: boolean;
}
