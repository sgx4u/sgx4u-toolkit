import type { Iteratee } from "../types/iteratee.types.js";

/**
 * How {@link getPercentile} turns a rank into a number.
 *
 * `"linear"` interpolates between the surrounding values. `"nearest"` uses
 * `Math.round` on the rank.
 */
export type PercentileMethod = "linear" | "nearest";

/**
 * Arguments for {@link getPercentile}.
 */
export interface GetPercentileParams<Item> {
    /** Values to rank. The array is not mutated. */
    array: readonly Item[];
    /**
     * Percentile from 0 through 100, inclusive.
     */
    percentile: number;
    /**
     * Reads the number to rank from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
    /**
     * How to resolve a rank that falls between two values.
     * @defaultValue "linear"
     */
    method?: PercentileMethod;
}
