import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link getVariance}.
 */
export interface GetVarianceParams<Item> {
    /** Values to measure. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reads the number to measure from one item.
     *
     * Omit it when the items are already finite numbers.
     */
    by?: Iteratee<Item, number>;
    /**
     * When true, divide by `n - 1` (sample variance).
     *
     * When false or omitted, divide by `n` (population variance).
     * @defaultValue false
     */
    sample?: boolean;
}
