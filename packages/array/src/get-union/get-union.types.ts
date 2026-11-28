import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getUnion}.
 */
export interface GetUnionParams<Item> {
    /**
     * Arrays to combine, from left to right.
     */
    arrays: readonly (readonly Item[])[];
    /**
     * When set, items are unique by this key under SameValueZero.
     * `equals` is not used.
     */
    by?: Iteratee<Item>;
    /**
     * Equality used when `by` is omitted.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
