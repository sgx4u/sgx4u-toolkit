import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link countOccurrences}.
 */
export interface CountOccurrencesParams<Item> {
    /**
     * Items to scan.
     */
    array: readonly Item[];
    /**
     * The value to count. `undefined` counts holes and missing elements.
     */
    value: Item;
    /**
     * Equality for `value` and an item.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
