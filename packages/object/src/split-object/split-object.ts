import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type {
    SplitObjectParams,
    SplitObjectResult,
} from "./split-object.types.js";

/**
 * Splits a plain object into the named keys and the rest.
 *
 * Each own enumerable string key is visited once and written to either
 * `picked` or `omitted`. Missing names are left out of `picked`. Both
 * results are new objects. The input is not mutated. Nested values keep
 * their references. A null-prototype source produces null-prototype results.
 *
 * Dangerous keys are written with `Object.defineProperty`. Symbol keys and
 * non-enumerable keys are not copied. Arrays, primitives, `null`, and other
 * non-plain values return `undefined`.
 *
 * @param params - The plain object and the keys that belong in `picked`.
 * @returns The two objects, or `undefined` when the input is not valid.
 * @example
 * splitObject({ object: { id: 1, name: "Ada" }, keys: ["id"] });
 */
export function splitObject(
    params: SplitObjectParams,
): SplitObjectResult | undefined {
    if (!isPlainObjectValue(params.object) || !Array.isArray(params.keys)) {
        return undefined;
    }
    const selected = namesFromKeys(params.keys);
    const picked = createDictionary(params.object);
    const omitted = createDictionary(params.object);
    for (const key of Object.keys(params.object)) {
        const target = selected.has(key) ? picked : omitted;
        writeOwnProperty(
            target,
            key,
            readOwnProperty(params.object, key),
            "keep",
        );
    }
    return { picked, omitted };
}

/**
 * Collects string names from a key list.
 *
 * Numbers are converted with `String`. Symbols are ignored because the
 * split walks enumerable string keys.
 *
 * @param keys - The keys the caller named.
 * @returns The string keys that belong in `picked`.
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
