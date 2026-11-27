import { isObjectLikeValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is an object whose prototype is `null`.
 *
 * `Object.create(null)` returns `true`. Ordinary objects, arrays, and
 * primitives return `false`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `Object.getPrototypeOf(value) === null`.
 * @example
 * isNullPrototypeObject(Object.create(null));
 */
export function isNullPrototypeObject(value: unknown): boolean {
    return isObjectLikeValue(value) && Object.getPrototypeOf(value) === null;
}
