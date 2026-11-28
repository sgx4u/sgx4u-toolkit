import type { Iteratee } from "../types/iteratee.types.js";

/**
 * One distinct value and how often it appears.
 */
export interface FrequencyEntry<Item> {
    /** The item when `by` is omitted, otherwise the key `by` returned. */
    value: unknown;
    /** The first item that produced `value`. */
    item: Item;
    /** How many items produced `value`. */
    count: number;
}

/**
 * Arguments for {@link getFrequencies}.
 */
export interface GetFrequenciesParams<Item> {
    /** Items to count. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the value to count.
     *
     * When omitted, the items themselves are counted. Keys use SameValueZero.
     */
    by?: Iteratee<Item>;
}
