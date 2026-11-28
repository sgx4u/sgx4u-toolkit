import { writeOwnProperty } from "../utils/dangerous-key.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { ZipObjectParams, ZippedObject } from "./zip-object.types.js";

/**
 * Builds an object by pairing keys and values at the same index.
 *
 * Extra keys are set to `undefined`. Extra values are ignored. When `values`
 * is not an array, every key is set to `undefined`. Dangerous keys are
 * skipped. The inputs are not mutated.
 *
 * @param params - The keys and the values.
 * @returns The new object, or `undefined` when `keys` is not an array.
 * @example
 * zipObject({ keys: ["a", "b"], values: [1] });
 */
export function zipObject(params: ZipObjectParams): ZippedObject | undefined {
    if (!isObjectLikeValue(params) || !Array.isArray(params.keys)) {
        return undefined;
    }
    const values = Array.isArray(params.values) ? params.values : undefined;
    const result: ZippedObject = {};
    for (let index = 0; index < params.keys.length; index += 1) {
        const key = propertyKey(params.keys[index]);
        if (key === undefined) {
            continue;
        }
        writeOwnProperty(result, key, valueAt(values, index), "skip");
    }
    return result;
}

/**
 * Reads a key entry when it can be a property name.
 *
 * @param value - One entry from `keys`.
 * @returns The property name, or `undefined` when the entry cannot be one.
 */
function propertyKey(value: unknown): PropertyKey | undefined {
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "symbol"
    ) {
        return value;
    }
    return undefined;
}

/**
 * Reads the value paired with a key.
 *
 * A missing `values` array, a short array, and a hole all mean `undefined`.
 *
 * @param values - The values array, when the caller passed one.
 * @param index - The shared index.
 * @returns The paired value, or `undefined` when there is none.
 */
function valueAt(
    values: readonly unknown[] | undefined,
    index: number,
): unknown {
    if (values === undefined || !Object.hasOwn(values, index)) {
        return undefined;
    }
    return values[index];
}
