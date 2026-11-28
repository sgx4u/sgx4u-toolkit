import { isArrayLikeValue } from "../utils/array.utils.js";

/**
 * Returns the length of an array, a typed array, or an array-like value.
 *
 * Strings are array-like, so their length is the number of characters.
 * Functions are excluded even when they have a `length`. Plain objects
 * without a valid length, `null`, and `undefined` return `undefined`. A
 * valid length is an integer from `0` through `2^53 - 1`. The value is
 * not mutated. This function does not throw.
 *
 * @param value - Any value.
 * @returns The length, or `undefined` when `value` is not array-like.
 * @example
 * getLength("text");
 */
export function getLength(value: unknown): number | undefined {
    if (!isArrayLikeValue(value)) {
        return undefined;
    }
    return value.length;
}
