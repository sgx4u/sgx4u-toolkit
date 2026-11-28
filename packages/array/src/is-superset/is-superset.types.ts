import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link isSuperset}.
 */
export interface IsSupersetParams<Item> {
    /**
     * The candidate superset.
     */
    array: readonly Item[];
    /**
     * Items that must all appear in `array`.
     */
    of: readonly Item[];
    /**
     * Equality for a member of `of` and an item. An invalid value makes the result `false`.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
