import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link binItems}.
 *
 * Provide exactly one of `binCount` and `binWidth`.
 */
export interface BinItemsParams<Item> {
    /** Values to bin. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to bin from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
    /**
     * How many equal-width bins to build.
     *
     * A positive integer. Do not set this together with `binWidth`.
     */
    binCount?: number;
    /**
     * Width of each bin.
     *
     * A positive finite number. Do not set this together with `binCount`.
     */
    binWidth?: number;
    /**
     * Left edge of the first bin.
     *
     * @defaultValue the minimum value in the data
     */
    start?: number;
    /**
     * Right edge of the range.
     *
     * Values greater than `end` are excluded. The last bin is closed on
     * this side when the bins are sized from `binCount`.
     * @defaultValue the maximum value in the data
     */
    end?: number;
}
