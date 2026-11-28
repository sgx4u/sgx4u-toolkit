import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link withoutValues}.
 */
export interface WithoutValuesParams<Item> {
    /**
     * Items to filter. Duplicates that are not excluded are kept.
     */
    array: readonly Item[];
    /**
     * Values to remove. Every matching item is removed.
     */
    values: readonly Item[];
    /**
     * Equality for an item and a value.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
