import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link getLastIndexOf}.
 */
export interface GetLastIndexOfParams<Item> {
    /** Array to search. */
    array: readonly Item[];

    /** Value to find. `NaN` matches `NaN` under the default equality. */
    value: Item;

    /**
     * Compares an item with `value`.
     *
     * The item is the first argument and `value` is the second. When this
     * is omitted, comparison is SameValueZero: `NaN` equals `NaN`, and
     * `-0` equals `0`.
     *
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;

    /**
     * Index at which to start searching backward.
     *
     * When this is omitted, the search starts at the last index. A
     * negative index counts from the end. An index past the end starts at
     * the last index. An index that falls before the start makes the
     * search return `undefined`. A non-integer makes the search return
     * `undefined`.
     *
     * @defaultValue the last index
     */
    fromIndex?: number;
}
