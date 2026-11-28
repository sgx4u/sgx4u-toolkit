import { isFalsy } from "../is-falsy/is-falsy.js";

/**
 * Reports whether `value` is truthy under JavaScript `ToBoolean`.
 *
 * This is the opposite of `isFalsy`. The string `"false"`, a non-empty
 * array, and `new Boolean(false)` are truthy. The function never throws.
 *
 * @param value - Any value. Every value has a truthiness.
 * @returns `true` when `value` is truthy.
 * @example
 * isTruthy("false"); // true
 */
export function isTruthy(value: unknown): boolean {
    return !isFalsy(value);
}
