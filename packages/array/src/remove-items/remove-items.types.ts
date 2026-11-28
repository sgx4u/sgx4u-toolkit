import type { Equals } from "../types/equals.types.js";
import type { Predicate } from "../types/iteratee.types.js";

/**
 * Parameters for {@link removeItems}.
 */
export interface RemoveItemsParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Keeps an item when this returns false.
     *
     * An item is removed when the predicate matches or the item equals one
     * of `values`. At least one of `predicate` and `values` is required
     * once `array` is an array.
     */
    predicate?: Predicate<Item>;

    /** Values to remove. Comparison uses `equals`. */
    values?: readonly Item[];

    /**
     * Compares an item with a value.
     *
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;
}
