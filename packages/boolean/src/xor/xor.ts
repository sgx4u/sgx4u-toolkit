import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether an odd number of entries are `true`.
 *
 * For two values this is "different". For three or more it is parity, not
 * "exactly one". Use `exactlyOne` for that question. An empty list has an
 * even count, so the result is `false`. A non-boolean entry returns
 * `undefined`. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when the number of `true` entries is odd, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * xor([true, true, true]); // true
 */
export function xor(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "xor");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount % 2 === 1;
}
