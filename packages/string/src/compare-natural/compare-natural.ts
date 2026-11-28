import { compareStrings } from "../compare-strings/compare-strings.js";
import type { CompareStringsOptions } from "../compare-strings/compare-strings.types.js";

/**
 * Compares two strings with numeric collation.
 *
 * `a2` sorts before `a10`. A non-string returns `undefined`, so this is
 * not a drop-in `Array#sort` comparator. The inputs are not changed.
 *
 * @param options - `first`, `second`, `locale`, and `sensitivity`.
 * @returns The comparison, or `undefined` when an input is not a string.
 * @throws {@link RangeError} When `sensitivity` is unknown.
 * @throws {@link TypeError} When `locale` or `sensitivity` has the wrong type.
 * @example
 * compareNatural({ first: "a2", second: "a10" });
 */
export function compareNatural(
    options: CompareStringsOptions,
): -1 | 0 | 1 | undefined {
    if (
        typeof options !== "object" ||
        options === null ||
        Array.isArray(options)
    ) {
        return undefined;
    }
    return compareStrings({ ...options, numeric: true });
}
