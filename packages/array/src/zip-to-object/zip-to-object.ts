import type { ZipToObjectParams } from "./zip-to-object.types.js";
import { readItem } from "../utils/array.utils.js";
import { typeError } from "../utils/errors.utils.js";
import { readParams } from "../utils/params.utils.js";

/**
 * Builds a record from keys and values.
 *
 * Each key is stringified with `String`. A symbol key becomes
 * `String(symbol)`, such as `"Symbol(id)"`. `values` may be an array or
 * `(key, index) => unknown`. A missing value is `undefined`. A later
 * duplicate key replaces the earlier one. `keys` and `values` are checked
 * before any record is built.
 *
 * @param params - The keys and the values.
 * @returns The record, or `undefined` when the argument is not an object.
 * @throws {@link TypeError} When `keys` is not an array, or when `values` is neither an array nor a function.
 * @example
 * zipToObject({ keys: ["a", "b"], values: [1, 2] });
 */
export function zipToObject(
    params: ZipToObjectParams,
): Record<string, unknown> | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function zipToObject(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function zipToObject(
    params: unknown,
): Record<string, unknown> | undefined {
    const resolved = readParams<ZipToObjectParams>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const keys = readKeys(resolved.keys);
    const values = readValues(resolved.values);
    return assignRecord(keys, values);
}

/**
 * @param keys - The candidate keys.
 * @returns The keys.
 * @throws {@link TypeError} When `keys` is not an array.
 */
function readKeys(keys: unknown): readonly unknown[] {
    if (!Array.isArray(keys)) {
        throw typeError("keys", "an array", keys);
    }
    return keys;
}

/**
 * @param values - The candidate values.
 * @returns An array or a function of a key and an index.
 * @throws {@link TypeError} When `values` is neither an array nor a function.
 */
function readValues(
    values: unknown,
): readonly unknown[] | ((key: unknown, index: number) => unknown) {
    if (Array.isArray(values)) {
        return values;
    }
    if (typeof values === "function") {
        return values as (key: unknown, index: number) => unknown;
    }
    throw typeError("values", "an array or a function", values);
}

/**
 * @param keys - Keys to stringify.
 * @param values - An array aligned with `keys`, or a function of each key.
 * @returns A new record. Duplicate keys keep the last value.
 */
function assignRecord(
    keys: readonly unknown[],
    values: readonly unknown[] | ((key: unknown, index: number) => unknown),
): Record<string, unknown> {
    const record: Record<string, unknown> = {};
    for (let index = 0; index < keys.length; index += 1) {
        const key = readItem(keys, index);
        const property = String(key);
        record[property] = readValue(values, key, index);
    }
    return record;
}

/**
 * @param values - An array or a function.
 * @param key - The key at `index`, before stringifying.
 * @param index - The key index.
 * @returns The value, or `undefined` when an array has no item there.
 */
function readValue(
    values: readonly unknown[] | ((key: unknown, index: number) => unknown),
    key: unknown,
    index: number,
): unknown {
    if (typeof values === "function") {
        return values(key, index);
    }
    if (index < values.length) {
        return readItem(values, index);
    }
    return undefined;
}
