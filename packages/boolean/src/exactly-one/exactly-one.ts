import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether precisely one entry is `true`.
 *
 * This is the question most callers mean by "xor" once a list has more than
 * two values. An empty list is `false`. A non-boolean entry returns
 * `undefined`. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when exactly one entry is `true`, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * exactlyOne([true, false, false]); // true
 */
export function exactlyOne(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "exactlyOne");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount === 1;
}
