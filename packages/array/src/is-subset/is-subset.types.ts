import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link isSubset}.
 */
export interface IsSubsetParams<Item> {
    /**
     * Items that must all appear in `of`.
     */
    array: readonly Item[];
    /**
     * The candidate superset.
     */
    of: readonly Item[];
    /**
     * Equality for an item and a member of `of`. An invalid value makes the result `false`.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
