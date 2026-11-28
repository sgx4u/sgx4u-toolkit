import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports the negation of `any`.
 *
 * An empty list is `true`, because `any([])` is `false`. A non-boolean
 * entry returns `undefined`. The array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when no entry is `true`, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * nor([false, false]); // true
 */
export function nor(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "nor");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount === 0;
}
