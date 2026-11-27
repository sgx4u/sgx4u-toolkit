import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { OmitParams } from "./omit.types.js";

/**
 * Copies a plain object without the named keys.
 *
 * Only own enumerable string keys are considered. When none of those keys
 * are named, the same object is returned. Otherwise the result is a new
 * object and the input is not mutated. Nested values keep their references.
 * A null-prototype source stays null-prototype.
 *
 * Symbol keys and non-enumerable keys are not copied onto a new result.
 * They remain only when the same object is returned. Dangerous keys that
 * are copied use `Object.defineProperty`, so `Object.prototype` is unchanged.
 *
 * Arrays, primitives, `null`, and other non-plain values return `undefined`.
 *
 * @param params - The plain object and the keys to drop.
 * @returns The object without those keys, or `undefined` when the input is not valid.
 * @example
 * omit({ object: { id: 1, name: "Ada" }, keys: ["name"] });
 */
export function omit(params: OmitParams): Record<string, unknown> | undefined {
    if (!isPlainObjectValue(params.object) || !Array.isArray(params.keys)) {
        return undefined;
    }
    const excluded = namesFromKeys(params.keys);
    for (const key of Object.keys(params.object)) {
        if (excluded.has(key)) {
            return copyRemainingKeys(params.object, excluded);
        }
    }
    return params.object;
}

/**
 * Copies enumerable string keys that are not excluded.
 *
 * @param source - The plain object being copied.
 * @param excluded - String keys to leave out.
 * @returns A new dictionary.
 */
function copyRemainingKeys(
    source: Record<string, unknown>,
    excluded: ReadonlySet<string>,
): Record<string, unknown> {
    const result = createDictionary(source);
    for (const key of Object.keys(source)) {
        if (excluded.has(key)) {
            continue;
        }
        writeOwnProperty(result, key, readOwnProperty(source, key), "keep");
    }
    return result;
}

/**
 * Collects string names from a key list.
 *
 * Numbers are converted with `String`. Symbols are ignored because `omit`
 * walks enumerable string keys.
 *
 * @param keys - The keys the caller named.
 * @returns The string keys to drop.
 */
function namesFromKeys(keys: readonly unknown[]): Set<string> {
    const names: Set<string> = new Set();
    for (const key of keys) {
        if (typeof key === "string") {
            names.add(key);
            continue;
        }
        if (typeof key === "number") {
            names.add(String(key));
        }
    }
    return names;
}
