import type { Equals } from "../types/equals.types.js";

/**
 * Items present on only one side of a multiset comparison.
 */
export interface ArrayMultisetDiff<Item> {
    /** Items of `second` that were not matched in `first`, in appearance order. */
    added: Item[];
    /** Items of `first` that were not matched in `second`, in appearance order. */
    removed: Item[];
}

/**
 * Arguments for {@link diffArrays}.
 */
export interface DiffArraysParams<Item> {
    /** The previous array. It is not mutated. */
    first: readonly Item[];
    /** The next array. It is not mutated. */
    second: readonly Item[];
    /**
     * Compares two items.
     *
     * One match consumes one occurrence on each side.
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;
}
