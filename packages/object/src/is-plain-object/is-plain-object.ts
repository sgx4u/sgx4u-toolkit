import type { PlainObject } from "../types/plain-object.types.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a plain object.
 *
 * True for an object created by `Object`, `Object.create(null)`, or the
 * equivalent constructor in another realm. False for arrays, dates, maps,
 * functions, class instances, and primitives. The check does not require this
 * realm's `Object.prototype`. It does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a plain object.
 * @example
 * isPlainObject({ id: 1 });
 */
export function isPlainObject(value: unknown): value is PlainObject {
    return isPlainObjectValue(value);
}
