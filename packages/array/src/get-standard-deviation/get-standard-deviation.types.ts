import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getStandardDeviation}.
 */
export interface GetStandardDeviationParams<Item> {
    /** Values to measure. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to measure from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
    /**
     * When true, use the sample variance (`n - 1`).
     *
     * When false or omitted, use the population variance.
     * @defaultValue false
     */
    sample?: boolean;
}
