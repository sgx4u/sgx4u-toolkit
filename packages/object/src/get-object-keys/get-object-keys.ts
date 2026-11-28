import type { ObjectKeys } from "../types/deep.types.js";
import { keysOf, resolveKeyList } from "../utils/object-keys.utils.js";
import type { ObjectKeyListParams } from "./get-object-keys.types.js";

/**
 * Lists the keys of an object.
 *
 * Pass an object to list its own enumerable string keys. Pass
 * `{ object, includeSymbols, includeNonEnumerable }` to change the filter.
 * An options object is recognized when its own string keys are a subset of
 * those three names and it owns `object`. `null` and primitives return
 * `undefined`. The input is not mutated.
 *
 * @param object - An object, or the options object.
 * @returns The keys, or `undefined` when the value is not object-like.
 * @example
 * getObjectKeys({ id: 1, name: "Ada" });
 */
export function getObjectKeys<T extends object>(object: T): ObjectKeys<T>;
/**
 * @param params - The object and key filters.
 */
export function getObjectKeys(
    params: ObjectKeyListParams,
): PropertyKey[] | undefined;
/**
 * @param object - A value that is not known to be an object.
 */
export function getObjectKeys(object: unknown): string[] | undefined;
/**
 * @param objectOrParams - An object or the options object.
 */
export function getObjectKeys(
    objectOrParams: unknown,
): PropertyKey[] | undefined {
    const resolved = resolveKeyList(objectOrParams);
    if (resolved === undefined) {
        return undefined;
    }
    const includeSymbols = resolved.includeSymbols === true;
    const includeNonEnumerable = resolved.includeNonEnumerable === true;
    return keysOf(resolved.object, includeSymbols, includeNonEnumerable);
}
