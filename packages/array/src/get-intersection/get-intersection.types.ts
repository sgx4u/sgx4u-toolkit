import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getIntersection}.
 */
export interface GetIntersectionParams<Item> {
    /**
     * Arrays to compare. Items come from the first array.
     */
    arrays: readonly (readonly Item[])[];
    /**
     * When set, presence uses SameValueZero on this key. `equals` is not used.
     */
    by?: Iteratee<Item>;
    /**
     * Equality used when `by` is omitted.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
