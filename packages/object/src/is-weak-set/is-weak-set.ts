import { isWeakSetValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a `WeakSet`.
 *
 * The check uses the `[object WeakSet]` tag, so a `WeakSet` from another
 * realm returns `true`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a `WeakSet`.
 * @example
 * isWeakSet(new WeakSet());
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
    return isWeakSetValue(value);
}
