import type { InvertByIteratee, InvertByParams } from "./invert-by.types.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import {
    createDictionary,
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";

const invertByFields = ["object", "iteratee"] as const;

/**
 * Groups the keys of a plain object by an iteratee.
 *
 * The argument is `{ object, iteratee }`. Each own enumerable string key is
 * placed in the array for `String(iteratee(value, key, object))`. The first
 * time a group appears sets its position. Keys inside a group stay in
 * enumeration order. When `iteratee` is omitted, the group is `String(value)`.
 * A group named `"__proto__"`, `"prototype"`, or `"constructor"` is skipped.
 * The input is not mutated. `null`, primitives, and arrays return `undefined`.
 *
 * @param params - The object and an optional iteratee.
 * @returns Groups of original keys, or `undefined` when `object` is not a plain object.
 * @throws {TypeError} When `iteratee` is present and is not a function.
 * @example
 * invertBy({ object: { a: 1, b: 2, c: 1 } });
 */
export function invertBy(
    params: InvertByParams,
): Record<string, string[]> | undefined {
    if (!isParameterRecord(params, "object", invertByFields)) {
        return undefined;
    }
    const iteratee = readIteratee(params);
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    return groupKeys(params.object, iteratee);
}

/**
 * Reads `iteratee` when the caller supplied one.
 *
 * @param params - A recognized options object.
 * @returns The iteratee, or `undefined` when the caller omitted it.
 * @throws {TypeError} When `iteratee` is present and is not a function.
 */
function readIteratee(
    params: Record<string, unknown>,
): InvertByIteratee | undefined {
    if (!Object.hasOwn(params, "iteratee")) {
        return undefined;
    }
    assertFunction(params.iteratee, "iteratee");
    return params.iteratee as InvertByIteratee;
}

/**
 * Groups the keys of `source`.
 *
 * @param source - A plain object.
 * @param iteratee - The group function, or `undefined` to stringify each value.
 * @returns The groups. A null-prototype source stays null-prototype.
 */
function groupKeys(
    source: Record<string, unknown>,
    iteratee: InvertByIteratee | undefined,
): Record<string, string[]> {
    const result = createDictionary(source);
    for (const key of Object.keys(source)) {
        const value = source[key];
        const group = String(
            iteratee === undefined ? value : iteratee(value, key, source),
        );
        if (isDangerousKey(group)) {
            continue;
        }
        appendKey(result, group, key);
    }
    return result as Record<string, string[]>;
}

/**
 * Appends `key` to the group array at `group`.
 *
 * @param result - The group object. It is mutated.
 * @param group - The stringified iteratee result.
 * @param key - The original key.
 */
function appendKey(result: object, group: string, key: string): void {
    const existing = readOwnProperty(result, group);
    if (Array.isArray(existing)) {
        existing.push(key);
        return;
    }
    writeOwnProperty(result, group, [key], "skip");
}
