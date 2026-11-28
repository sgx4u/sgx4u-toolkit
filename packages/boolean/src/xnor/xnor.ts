import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether an even number of entries are `true`.
 *
 * For two values this is also equivalence. For three or more it is parity,
 * not "all equal": `xnor` of three `true` values is `false`. Use `areEqual`
 * for that question. An empty list is `true`. A non-boolean entry returns
 * `undefined`. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when the number of `true` entries is even, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * xnor([true, true, true]); // false
 */
export function xnor(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "xnor");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount % 2 === 0;
}
