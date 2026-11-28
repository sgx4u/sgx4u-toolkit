import { isTypedArrayValue } from "../utils/array.utils.js";

/**
 * Reports whether `value` is a typed array.
 *
 * `DataView` is an `ArrayBuffer` view and is not a typed array. Ordinary
 * arrays, array-like objects, and iterables are not typed arrays. The
 * value is not mutated. This function does not throw.
 *
 * @param value - Any value.
 * @returns `true` for a typed array such as `Uint8Array` or `Float64Array`.
 * @example
 * isTypedArray(new Uint8Array([1]));
 */
export function isTypedArray(value: unknown): boolean {
    return isTypedArrayValue(value);
}
