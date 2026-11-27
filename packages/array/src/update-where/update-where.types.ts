import type { Predicate } from "../types/iteratee.types.js";

/**
 * Parameters for {@link updateWhere}.
 */
export interface UpdateWhereParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /** Selects the items to update. */
    predicate: Predicate<Item>;

    /**
     * Returns the replacement for a matching item.
     *
     * This argument is always a function. It is not used as a stored value.
     */
    updater: (item: Item, index: number) => Item;

    /**
     * When true, every match is updated. Otherwise only the first match is.
     *
     * @defaultValue false
     */
    all?: boolean;
}
