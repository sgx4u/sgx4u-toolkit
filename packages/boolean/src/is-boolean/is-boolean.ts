/**
 * Reports whether `value` is a primitive boolean.
 *
 * A boxed `Boolean` is an object, so it returns `false`. The check is
 * `typeof value === "boolean"`, which stays valid across realms. The
 * function never throws.
 *
 * @param value - Any value. Only `true` and `false` match.
 * @returns `true` when `value` is a primitive boolean.
 * @example
 * isBoolean(false); // false is a boolean, so the result is true
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}
