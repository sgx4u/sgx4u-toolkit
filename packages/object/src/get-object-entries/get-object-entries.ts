import type { ObjectEntries } from "../types/deep.types.js";
import type { ObjectKeyListParams } from "../get-object-keys/get-object-keys.types.js";
import { keysOf, resolveKeyList } from "../utils/object-keys.utils.js";

/**
 * Lists `[key, value]` pairs for an object's selected keys.
 *
 * The argument shape matches `getObjectKeys`. The input is not mutated.
 * A non-object returns `undefined`.
 *
 * @param object - An object, or the options object.
 * @returns The entries, or `undefined` when the value is not object-like.
 * @example
 * getObjectEntries({ id: 1 });
 */
export function getObjectEntries<T extends object>(object: T): ObjectEntries<T>;
/**
 * @param params - The object and key filters.
 */
export function getObjectEntries(
    params: ObjectKeyListParams,
): Array<[PropertyKey, unknown]> | undefined;
/**
 * @param objectOrParams - An object or the options object.
 */
export function getObjectEntries(
    objectOrParams: unknown,
): Array<[PropertyKey, unknown]> | undefined {
    const resolved = resolveKeyList(objectOrParams);
    if (resolved === undefined) {
        return undefined;
    }
    const keys = keysOf(
        resolved.object,
        resolved.includeSymbols === true,
        resolved.includeNonEnumerable === true,
    );
    if (
        keys === undefined ||
        typeof resolved.object !== "object" ||
        resolved.object === null
    ) {
        return undefined;
    }
    const source = resolved.object as Record<PropertyKey, unknown>;
    return keys.map((key) => [key, source[key]]);
}
