import type { JSONValue } from "../types/json-value.types.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is JSON data.
 *
 * Objects, arrays, strings, finite numbers, booleans, and `null` qualify.
 * `undefined`, functions, symbols, bigints, `NaN`, infinities, symbol keys,
 * holes, and cycles do not. A shared reference that is not a cycle is allowed.
 * The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a JSON value.
 * @example
 * isJSONValue({ ok: true });
 */
export function isJSONValue(value: unknown): value is JSONValue {
    return isJSONNode(value, new Set());
}

/**
 * Walks one JSON node.
 *
 * Ancestors are removed after the node so a later sibling may point at it.
 *
 * @param value - The current value.
 * @param ancestors - Objects currently on the path.
 * @returns `true` when this node and its children are JSON data.
 */
function isJSONNode(value: unknown, ancestors: Set<object>): boolean {
    if (value === null) {
        return true;
    }
    if (typeof value === "boolean" || typeof value === "string") {
        return true;
    }
    if (typeof value === "number") {
        return Number.isFinite(value);
    }
    if (typeof value !== "object") {
        return false;
    }
    if (ancestors.has(value)) {
        return false;
    }
    ancestors.add(value);
    const valid = isJSONContainer(value, ancestors);
    ancestors.delete(value);
    return valid;
}

/**
 * Reports whether an object node's children are JSON data.
 *
 * @param value - A non-null object.
 * @param ancestors - Objects currently on the path.
 * @returns `true` when the container is a JSON object or array.
 */
function isJSONContainer(value: object, ancestors: Set<object>): boolean {
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
            if (!Object.hasOwn(value, index)) {
                return false;
            }
            if (!isJSONNode(value[index], ancestors)) {
                return false;
            }
        }
        return true;
    }
    if (!isPlainObjectValue(value)) {
        return false;
    }
    if (Object.getOwnPropertySymbols(value).length > 0) {
        return false;
    }
    for (const key of Object.keys(value)) {
        if (!isJSONNode(value[key], ancestors)) {
            return false;
        }
    }
    return true;
}
