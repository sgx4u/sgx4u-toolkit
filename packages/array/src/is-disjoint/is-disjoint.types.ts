import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link isDisjoint}.
 */
export interface IsDisjointParams<Item> {
    /**
     * The first array.
     */
    first: readonly Item[];
    /**
     * The second array.
     */
    second: readonly Item[];
    /**
     * Equality for an item from each array. An invalid value makes the result `false`.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
