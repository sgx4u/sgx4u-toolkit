import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether every entry is `true`.
 *
 * An empty list is `true`, matching `Array#every`. A non-boolean entry
 * returns `undefined` instead of coercing. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when every entry is `true`, `false` when a `false` is present, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * all([true, true]); // true
 */
export function all(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "all");
    if (counts === undefined) {
        return undefined;
    }
    return counts.falseCount === 0;
}
