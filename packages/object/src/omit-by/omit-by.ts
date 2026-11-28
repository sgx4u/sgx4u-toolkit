import { assertFunction } from "../utils/describe-received.utils.js";
import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { OmitByParams } from "./omit-by.types.js";

/**
 * Copies a plain object without the keys selected by `predicate`.
 *
 * The predicate is called as `predicate(value, key, object)` for each own
 * enumerable string key. A truthy result drops the key. When every key is
 * kept, the same object is returned. Otherwise the result is a new object.
 * The input is not mutated. Nested values keep their references.
 *
 * Dangerous keys that remain are written with `Object.defineProperty`.
 * Symbol keys are not visited and are not copied onto a new result. Arrays,
 * primitives, `null`, and other non-plain values return `undefined` and the
 * predicate is not called. A predicate that is not a function raises
 * `TypeError` before that check.
 *
 * @param params - The plain object and the predicate.
 * @returns The object without the selected keys, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `predicate` is not a function.
 * @example
 * omitBy({
 *     object: { id: 1, name: "Ada" },
 *     predicate: (value) => typeof value === "string",
 * });
 */
export function omitBy(
    params: OmitByParams,
): Record<string, unknown> | undefined {
    assertFunction(params.predicate, "predicate");
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    const dropped = keysToDrop(params.object, params.predicate);
    if (dropped.size === 0) {
        return params.object;
    }
    return copyRemainingKeys(params.object, dropped);
}

/**
 * Lists enumerable string keys the predicate wants removed.
 *
 * @param source - The plain object being scanned.
 * @param predicate - Returns `true` to drop a key.
 * @returns The keys to leave out.
 */
function keysToDrop(
    source: Record<string, unknown>,
    predicate: OmitByParams["predicate"],
): Set<string> {
    const dropped: Set<string> = new Set();
    for (const key of Object.keys(source)) {
        if (predicate(readOwnProperty(source, key), key, source)) {
            dropped.add(key);
        }
    }
    return dropped;
}

/**
 * Copies enumerable string keys that were not dropped.
 *
 * @param source - The plain object being copied.
 * @param dropped - Keys the predicate rejected.
 * @returns A new dictionary.
 */
function copyRemainingKeys(
    source: Record<string, unknown>,
    dropped: ReadonlySet<string>,
): Record<string, unknown> {
    const result = createDictionary(source);
    for (const key of Object.keys(source)) {
        if (dropped.has(key)) {
            continue;
        }
        writeOwnProperty(result, key, readOwnProperty(source, key), "keep");
    }
    return result;
}
