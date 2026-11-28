import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Counts entries that are `true`.
 *
 * An empty list is `0`. A non-boolean entry returns `undefined` rather than
 * a partial count. The array is left unchanged.
 *
 * @param values - Entries to count.
 * @returns The number of `true` entries, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * countTrue([true, false, true]); // 2
 */
export function countTrue(values: readonly unknown[]): number | undefined {
    const counts = countBooleanValues(values, "countTrue");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount;
}
