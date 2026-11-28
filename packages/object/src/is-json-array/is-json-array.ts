import type { JSONArray } from "../types/json-value.types.js";
import { isJSONValue } from "../is-json-value/is-json-value.js";

/**
 * Reports whether `value` is a JSON array.
 *
 * Holes, `undefined` elements, and cycles return `false`. The function does
 * not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a JSON array.
 * @example
 * isJSONArray([1, "a", null]);
 */
export function isJSONArray(value: unknown): value is JSONArray {
    return Array.isArray(value) && isJSONValue(value);
}
