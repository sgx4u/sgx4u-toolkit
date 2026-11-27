import {
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { DefaultsParams } from "./defaults.types.js";

/**
 * Fills missing and `undefined` keys on a shallow copy.
 *
 * `object` wins. Each defaults object then fills keys that are still missing
 * or `undefined`. A present `null`, `0`, or `""` stays. Nested objects are
 * not merged; a present object is kept by reference. The result is always a
 * new dictionary, including when `object` is an array. Dangerous keys are
 * skipped. The inputs are not mutated.
 *
 * An array `defaults` is a list of sources. A single object is one source.
 *
 * @param params - The source of truth and the values that fill gaps.
 * @returns A new object, or `undefined` when `object` is not object-like or `defaults` is neither object-like nor an array.
 * @example
 * defaults({ object: { a: 1, b: undefined }, defaults: { b: 2, c: 3 } });
 */
export function defaults(
    params: DefaultsParams,
): Record<string, unknown> | undefined {
    if (!isObjectLikeValue(params) || !isObjectLikeValue(params.object)) {
        return undefined;
    }
    const sources = listDefaultSources(params.defaults);
    if (sources === undefined) {
        return undefined;
    }
    const result: Record<string, unknown> = {};
    copyEnumerableKeys(result, params.object);
    for (const source of sources) {
        if (!isObjectLikeValue(source)) {
            continue;
        }
        fillMissingKeys(result, source);
    }
    return result;
}

/**
 * Reads `defaults` as one object or a list of objects.
 *
 * @param value - The `defaults` argument.
 * @returns The sources, or `undefined` when `value` cannot be a source list.
 */
function listDefaultSources(value: unknown): readonly unknown[] | undefined {
    if (Array.isArray(value)) {
        return value;
    }
    if (isObjectLikeValue(value)) {
        return [value];
    }
    return undefined;
}

/**
 * Copies own enumerable string keys, including keys whose value is `undefined`.
 *
 * @param target - The object that receives the keys. It is mutated.
 * @param source - The object whose keys are copied. It is not mutated.
 */
function copyEnumerableKeys(
    target: Record<string, unknown>,
    source: object,
): void {
    for (const key of Object.keys(source)) {
        writeOwnProperty(target, key, readOwnProperty(source, key), "skip");
    }
}

/**
 * Writes keys that are missing or `undefined` on `target`.
 *
 * @param target - The object being filled. It is mutated.
 * @param source - One defaults object. It is not mutated.
 */
function fillMissingKeys(
    target: Record<string, unknown>,
    source: object,
): void {
    for (const key of Object.keys(source)) {
        if (Object.hasOwn(target, key) && target[key] !== undefined) {
            continue;
        }
        writeOwnProperty(target, key, readOwnProperty(source, key), "skip");
    }
}
