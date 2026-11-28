import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether every entry is the same boolean.
 *
 * This is the question most callers mean by "xnor" once a list has more
 * than two values. An empty list is `true`, and so is a list of one
 * boolean. A non-boolean entry returns `undefined`. The array is left
 * unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when every entry is `true` or every entry is `false`, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * areEqual([true, true, true]); // true
 */
export function areEqual(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "areEqual");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount === 0 || counts.falseCount === 0;
}
