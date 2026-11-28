import type { JSONObject } from "../types/json-value.types.js";
import { isJSONValue } from "../is-json-value/is-json-value.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is a JSON object.
 *
 * Arrays return `false`. The value must otherwise satisfy `isJSONValue`.
 * The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a JSON object.
 * @example
 * isJSONObject({ id: 1 });
 */
export function isJSONObject(value: unknown): value is JSONObject {
    return isPlainObjectValue(value) && isJSONValue(value);
}
