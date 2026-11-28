import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";

/**
 * Copies the own enumerable string keys of `object` into a `Map`.
 *
 * Symbol keys are not included. Insertion order is preserved. A value that
 * is not object-like returns `undefined`. The input is not mutated.
 *
 * @param object - Any value.
 * @returns A map of string keys, or `undefined` when `object` is not object-like.
 * @example
 * toMap({ id: 1, name: "Ada" });
 */
export function toMap(object: unknown): Map<string, unknown> | undefined {
    if (!isObjectLikeValue(object)) {
        return undefined;
    }
    const map = new Map<string, unknown>();
    for (const key of Object.keys(object)) {
        map.set(key, readOwnProperty(object, key));
    }
    return map;
}
