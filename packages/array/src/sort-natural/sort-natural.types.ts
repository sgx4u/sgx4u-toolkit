import type { Direction } from "../types/sort.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link sortNatural}.
 */
export interface SortNaturalParams<Item> {
    /**
     * Items to sort. The array is not mutated.
     */
    array: readonly Item[];
    /**
     * Property key or function. Omit it to sort the items themselves.
     * @defaultValue the item
     */
    by?: Iteratee<Item>;
    /**
     * Sort direction. Null placement does not flip with this.
     * @defaultValue "ascending"
     */
    direction?: Direction;
    /**
     * BCP 47 language tag or list.
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * Where `null`, `undefined`, and `NaN` keys go.
     * @defaultValue "last"
     */
    nulls?: "first" | "last";
}
