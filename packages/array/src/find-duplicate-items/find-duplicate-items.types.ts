import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link findDuplicateItems}.
 */
export interface FindDuplicateItemsParams<Item> {
    /**
     * Items to scan from left to right.
     */
    array: readonly Item[];
    /**
     * When set, duplicates use SameValueZero on this key. `equals` is not used.
     */
    by?: Iteratee<Item>;
    /**
     * Equality used when `by` is omitted.
     * @defaultValue SameValueZero (`NaN` equals `NaN`, and `-0` equals `0`)
     */
    equals?: Equals<Item>;
}
