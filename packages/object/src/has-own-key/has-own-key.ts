import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { HasOwnKeyParams } from "./has-own-key.types.js";

/**
 * Reports whether `object` has `key` as an own property.
 *
 * Uses `Object.hasOwn`. `null`, primitives, and functions return `false`
 * instead of throwing.
 *
 * @param params - The object and key.
 * @returns `true` when the key is an own property.
 * @example
 * hasOwnKey({ object: { id: 1 }, key: "id" });
 */
export function hasOwnKey(params: HasOwnKeyParams): boolean {
    if (!isObjectLikeValue(params.object)) {
        return false;
    }
    return Object.hasOwn(params.object, params.key);
}
