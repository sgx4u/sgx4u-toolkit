import type { Direction, SortKey } from "../types/sort.types.js";

/**
 * Arguments for {@link isSorted}.
 */
export interface IsSortedParams<Item> {
    /**
     * Items to test. An empty array and a one-item array are sorted.
     */
    array: readonly Item[];
    /**
     * Sort keys. Omit them to compare the items themselves.
     * @defaultValue the item, with the call-level direction
     */
    keys?: readonly SortKey<Item>[];
    /**
     * Direction used when a key does not set one.
     * @defaultValue "ascending"
     */
    direction?: Direction;
    /**
     * BCP 47 language tag or list.
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * When true, number-like parts of strings compare as numbers.
     * @defaultValue false
     */
    numeric?: boolean;
    /**
     * Collator sensitivity.
     * @defaultValue "variant"
     */
    sensitivity?: "base" | "accent" | "case" | "variant";
    /**
     * Where `null`, `undefined`, and `NaN` keys go.
     * @defaultValue "last"
     */
    nulls?: "first" | "last";
}
