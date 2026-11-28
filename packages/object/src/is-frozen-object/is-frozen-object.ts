import { isObjectLikeValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a frozen object.
 *
 * Uses `Object.isFrozen`. Primitives, `null`, and functions return `false`.
 * The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a frozen object.
 * @example
 * isFrozenObject(Object.freeze({ id: 1 }));
 */
export function isFrozenObject(value: unknown): boolean {
    return isObjectLikeValue(value) && Object.isFrozen(value);
}
