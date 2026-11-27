import type { NonEmptyArray } from "../types/non-empty-array.types.js";

/**
 * Reports whether `value` is an array with at least one item.
 *
 * A hole still counts as an item: an array of length `1` whose only
 * position is empty is non-empty, and reading that position yields
 * `undefined`. Typed arrays, strings, and array-like objects return
 * `false`. The value is not mutated. This function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is an array whose length is at least `1`.
 * @example
 * isNonEmptyArray([1]);
 */
export function isNonEmptyArray(
    value: unknown,
): value is NonEmptyArray<unknown> {
    return Array.isArray(value) && value.length >= 1;
}
