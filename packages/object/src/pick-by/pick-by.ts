import { assertFunction } from "../utils/describe-received.utils.js";
import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { PickByParams } from "./pick-by.types.js";

/**
 * Copies the own enumerable string keys selected by `predicate`.
 *
 * The predicate is called as `predicate(value, key, object)` for each own
 * enumerable string key. A truthy result copies the key. The result is
 * always a new object when `object` is a plain object, including when no
 * key is selected. The input is not mutated. Nested values keep their
 * references.
 *
 * Dangerous keys that the predicate selects are written with
 * `Object.defineProperty`. Symbol keys are not visited. Arrays, primitives,
 * `null`, and other non-plain values return `undefined` and the predicate
 * is not called. A predicate that is not a function raises `TypeError`
 * before that check.
 *
 * @param params - The plain object and the predicate.
 * @returns The new object, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `predicate` is not a function.
 * @example
 * pickBy({
 *     object: { id: 1, name: "Ada" },
 *     predicate: (value) => typeof value === "number",
 * });
 */
export function pickBy(
    params: PickByParams,
): Record<string, unknown> | undefined {
    assertFunction(params.predicate, "predicate");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    const result = createDictionary(params.object);
    for (const key of Object.keys(params.object)) {
        const value = readOwnProperty(params.object, key);
        if (!params.predicate(value, key, params.object)) {
            continue;
        }
        writeOwnProperty(result, key, value, "keep");
    }
    return result;
}
