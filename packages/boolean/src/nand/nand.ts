import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports the negation of `all`.
 *
 * An empty list is `false`, because `all([])` is `true`. A non-boolean
 * entry returns `undefined`. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when some entry is `false`, `false` when every entry is `true`, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * nand([true, false]); // true
 */
export function nand(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "nand");
    if (counts === undefined) {
        return undefined;
    }
    return counts.falseCount > 0;
}
