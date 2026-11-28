import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getDifference}.
 */
export interface GetDifferenceParams<Item> {
    /**
     * Items that may be kept.
     */
    array: readonly Item[];
    /**
     * Arrays of items to exclude.
     */
    others: readonly (readonly Item[])[];
    /**
     * When set, exclusion uses SameValueZero on this key. `equals` is not used.
     */
    by?: Iteratee<Item>;
    /**
     * Equality used when `by` is omitted.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
