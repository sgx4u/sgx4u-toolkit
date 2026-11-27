import { keysOf, resolveKeyList } from "../utils/object-keys.utils.js";
import type { ObjectKeyListParams } from "../get-object-keys/get-object-keys.types.js";

/**
 * Lists the values of an object's selected keys.
 *
 * The argument shape matches `getObjectKeys`. Values stay in key order.
 * The input is not mutated. A non-object returns `undefined`.
 *
 * @param object - An object, or the options object.
 * @returns The values, or `undefined` when the value is not object-like.
 * @example
 * getObjectValues({ id: 1, name: "Ada" });
 */
export function getObjectValues(object: unknown): unknown[] | undefined;
/**
 * @param params - The object and key filters.
 */
export function getObjectValues(
    params: ObjectKeyListParams,
): unknown[] | undefined;
/**
 * @param objectOrParams - An object or the options object.
 */
export function getObjectValues(
    objectOrParams: unknown,
): unknown[] | undefined {
    const resolved = resolveKeyList(objectOrParams);
    if (resolved === undefined) {
        return undefined;
    }
    const keys = keysOf(
        resolved.object,
        resolved.includeSymbols === true,
        resolved.includeNonEnumerable === true,
    );
    if (keys === undefined || !isRecord(resolved.object)) {
        return undefined;
    }
    const source = resolved.object;
    return keys.map((key) => source[key]);
}

/**
 * Whether `value` can be indexed by a property key.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a non-null object.
 */
function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
    return typeof value === "object" && value !== null;
}
