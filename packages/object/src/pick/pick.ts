import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { PickParams } from "./pick.types.js";

/**
 * Copies the named own keys onto a new object.
 *
 * Keys that are not own properties are left out. The result follows the
 * order of `keys`, without duplicates of a key that was already copied.
 * Arrays, primitives, `null`, functions, and class instances return
 * `undefined`. The input is not mutated. Nested values keep their
 * references.
 *
 * A dangerous own key is written with `Object.defineProperty`, so an
 * explicit pick of `__proto__`, `prototype`, or `constructor` does not
 * change `Object.prototype`.
 *
 * @param params - The plain object and the keys to keep.
 * @returns The new object, or `undefined` when `object` is not a plain object or `keys` is not an array.
 * @example
 * pick({ object: { id: 1, name: "Ada" }, keys: ["id"] });
 */
export function pick(params: PickParams): Record<string, unknown> | undefined {
    if (!isPlainObjectValue(params.object) || !Array.isArray(params.keys)) {
        return undefined;
    }
    const result = createDictionary(params.object);
    for (const key of params.keys) {
        if (!isPropertyKey(key) || !Object.hasOwn(params.object, key)) {
            continue;
        }
        writeOwnProperty(
            result,
            key,
            readOwnProperty(params.object, key),
            "keep",
        );
    }
    return result;
}

/**
 * Whether `value` can be a property name.
 *
 * @param value - One entry from `keys`.
 * @returns `true` for a string, number, or symbol.
 */
function isPropertyKey(value: unknown): value is PropertyKey {
    const kind = typeof value;
    return kind === "string" || kind === "number" || kind === "symbol";
}
