import { isArrayLikeValue } from "../utils/array.utils.js";

/**
 * Reports whether `value` has an array-like length.
 *
 * A length is an integer from `0` through `2^53 - 1`. Strings are
 * array-like. Functions are not, even when they have a `length`. `null`
 * is not array-like. The value is not mutated. This function does not
 * throw.
 *
 * @param value - Any value. Arrays, typed arrays, strings, and objects with a valid `length` are array-like.
 * @returns `true` when `value` is array-like.
 * @example
 * isArrayLike("text");
 */
export function isArrayLike(value: unknown): boolean {
    return isArrayLikeValue(value);
}
