import { isPlainObjectValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a plain object with no own enumerable string keys.
 *
 * Symbol keys and non-enumerable keys are ignored. Arrays, `null`, and
 * primitives return `false`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is an empty plain object.
 * @example
 * isEmptyObject({});
 */
export function isEmptyObject(value: unknown): boolean {
    return isPlainObjectValue(value) && Object.keys(value).length === 0;
}
