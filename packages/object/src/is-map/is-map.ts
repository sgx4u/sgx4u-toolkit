import { isMapValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a `Map`.
 *
 * The check uses the `[object Map]` tag, so a `Map` from another realm
 * returns `true`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a `Map`.
 * @example
 * isMap(new Map());
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
    return isMapValue(value);
}
