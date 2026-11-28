import { countBooleanValues } from "../utils/count-boolean-values.utils.js";

/**
 * Reports whether no entry is `true`.
 *
 * An empty list is `true`. A non-boolean entry returns `undefined`. The
 * array is left unchanged.
 *
 * @param values - Entries to test.
 * @returns `true` when every entry is `false` or the list is empty, or `undefined` when an entry is not a primitive boolean.
 * @throws {TypeError} When `values` is not an array.
 * @example
 * none([false, false]); // true
 */
export function none(values: readonly unknown[]): boolean | undefined {
    const counts = countBooleanValues(values, "none");
    if (counts === undefined) {
        return undefined;
    }
    return counts.trueCount === 0;
}
