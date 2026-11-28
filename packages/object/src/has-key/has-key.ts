import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { HasKeyParams } from "./has-key.types.js";

/**
 * Reports whether `object` has `key`.
 *
 * Own properties are checked with `Object.hasOwn`. Inherited properties are
 * checked with `in` only when `inherited` is true. `null` returns `false`
 * instead of throwing.
 *
 * @param params - The object, key, and inheritance flag.
 * @returns `true` when the key is present.
 * @example
 * hasKey({ object: { id: 1 }, key: "id" });
 */
export function hasKey(params: HasKeyParams): boolean {
    if (!isObjectLikeValue(params.object)) {
        return false;
    }
    if (params.inherited === true) {
        return params.key in params.object;
    }
    return Object.hasOwn(params.object, params.key);
}
