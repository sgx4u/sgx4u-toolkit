import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link isPermutationOf}.
 */
export interface IsPermutationOfParams<Item> {
    /**
     * Items to compare, in any order.
     */
    array: readonly Item[];
    /**
     * The other items. Multiplicity must match `array`.
     */
    other: readonly Item[];
    /**
     * Equality for two items. An invalid value makes the result `false`.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
