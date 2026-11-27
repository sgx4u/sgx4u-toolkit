import { isObjectLikeValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a non-null object.
 *
 * `typeof value === "object" && value !== null`. Arrays and dates are
 * object-like. Functions are not. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is object-like.
 * @example
 * isObjectLike([]);
 */
export function isObjectLike(value: unknown): value is object {
    return isObjectLikeValue(value);
}
