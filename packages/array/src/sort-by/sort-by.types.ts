import type { Direction, SortKey } from "../types/sort.types.js";

/**
 * Arguments for {@link sortBy}.
 */
export interface SortByParams<Item> {
    /**
     * Items to sort. The array is not mutated.
     */
    array: readonly Item[];
    /**
     * Sort keys, applied from left to right. An empty list keeps the original order.
     */
    keys: readonly SortKey<Item>[];
    /**
     * Default direction. A key can override it.
     * @defaultValue "ascending"
     */
    direction?: Direction;
    /**
     * BCP 47 language tag or list. A key can override it.
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * When true, number-like parts of strings compare as numbers.
     * @defaultValue false
     */
    numeric?: boolean;
    /**
     * Collator sensitivity. A key can override it.
     * @defaultValue "variant"
     */
    sensitivity?: "base" | "accent" | "case" | "variant";
    /**
     * Where `null`, `undefined`, and `NaN` keys go. Direction does not flip this.
     * @defaultValue "last"
     */
    nulls?: "first" | "last";
}
