import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether any entry is `true`.
 *
 * An empty list is `false`, matching `Array#some`. A non-boolean entry
 * returns `undefined`. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when a `true` is present, `false` when every entry is `false`, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * any([false, true]); // true
 */
export function any(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "any");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount > 0;
}
