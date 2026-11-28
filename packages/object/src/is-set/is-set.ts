import { isSetValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a `Set`.
 *
 * The check uses the `[object Set]` tag, so a `Set` from another realm
 * returns `true`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a `Set`.
 * @example
 * isSet(new Set());
 */
export function isSet(value: unknown): value is Set<unknown> {
    return isSetValue(value);
}
