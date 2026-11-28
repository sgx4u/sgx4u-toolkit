import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link getIndexOf}.
 */
export interface GetIndexOfParams<Item> {
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
     * Index at which to start searching forward.
     *
     * A negative index counts from the end and is clamped to `0` when it
     * falls before the start. A non-integer makes the search return
     * `undefined`.
     *
     * @defaultValue 0
     */
    fromIndex?: number;
}
