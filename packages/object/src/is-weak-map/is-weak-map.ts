import { isWeakMapValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a `WeakMap`.
 *
 * The check uses the `[object WeakMap]` tag, so a `WeakMap` from another
 * realm returns `true`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a `WeakMap`.
 * @example
 * isWeakMap(new WeakMap());
 */
export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
    return isWeakMapValue(value);
}
