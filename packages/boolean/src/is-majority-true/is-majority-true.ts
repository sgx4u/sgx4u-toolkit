import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether `true` strictly outnumbers `false`.
 *
 * A tie is `false`. An empty list is `false`. The name asks a question
 * about the list. A non-boolean entry still returns `undefined`, so a bad
 * list is not reported as "no majority". The array is left unchanged.
 *
 * @param values - Entries to compare.
 * @returns `true` when there are more `true` entries than `false` entries, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * isMajorityTrue([true, true, false]); // true
 */
export function isMajorityTrue(
    values: readonly unknown[],
): boolean | undefined {
    const counts = countBooleanValues(values, "isMajorityTrue");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount > counts.falseCount;
}
