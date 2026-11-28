import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link isUnique}.
 */
export interface IsUniqueParams<Item> {
    /**
     * Items to scan for a repeated value.
     */
    array: readonly Item[];
    /**
     * When set, uniqueness uses SameValueZero on this key. `equals` is not used.
     */
    by?: Iteratee<Item>;
    /**
     * Equality used when `by` is omitted. An invalid value makes the result `false`.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
