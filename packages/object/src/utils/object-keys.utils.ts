import type { ObjectKeyListParams } from "../get-object-keys/get-object-keys.types.js";
import { isParameterRecord } from "./parameter-record.utils.js";
import { isObjectLikeValue } from "./value-kind.utils.js";

const keyListFields = [
    "object",
    "includeSymbols",
    "includeNonEnumerable",
] as const;

/**
 * Resolves either a bare object or the options form.
 *
 * @param objectOrParams - The argument passed to a key-list function.
 * @returns The object and the two flags, or `undefined` when the options form is incomplete.
 */
export function resolveKeyList(
    objectOrParams: unknown,
): ObjectKeyListParams | undefined {
    if (
        isParameterRecord(objectOrParams, "object", keyListFields) &&
        (Object.hasOwn(objectOrParams, "includeSymbols") ||
            Object.hasOwn(objectOrParams, "includeNonEnumerable"))
    ) {
        return {
            includeNonEnumerable: objectOrParams.includeNonEnumerable === true,
            includeSymbols: objectOrParams.includeSymbols === true,
            object: objectOrParams.object,
        };
    }
    if (isParameterRecord(objectOrParams, "object", keyListFields)) {
        return {
            includeNonEnumerable: false,
            includeSymbols: false,
            object: objectOrParams.object,
        };
    }
    return {
        includeNonEnumerable: false,
        includeSymbols: false,
        object: objectOrParams,
    };
}

/**
 * Lists the selected keys of an object.
 *
 * @param object - An object-like value.
 * @param includeSymbols - Whether symbol keys are included.
 * @param includeNonEnumerable - Whether non-enumerable names are included.
 * @returns The keys. `undefined` is not returned; a non-object has no keys.
 */
export function listObjectKeys(
    object: object,
    includeSymbols: boolean,
    includeNonEnumerable: boolean,
): PropertyKey[] {
    const keys: PropertyKey[] = includeNonEnumerable
        ? Object.getOwnPropertyNames(object)
        : Object.keys(object);
    if (!includeSymbols) {
        return keys;
    }
    for (const symbol of Object.getOwnPropertySymbols(object)) {
        const descriptor = Object.getOwnPropertyDescriptor(object, symbol);
        if (includeNonEnumerable || descriptor?.enumerable === true) {
            keys.push(symbol);
        }
    }
    return keys;
}

/**
 * Lists keys when `value` is object-like.
 *
 * @param value - Any value.
 * @param includeSymbols - Whether symbol keys are included.
 * @param includeNonEnumerable - Whether non-enumerable names are included.
 * @returns The keys, or `undefined` when `value` is not object-like.
 */
export function keysOf(
    value: unknown,
    includeSymbols: boolean,
    includeNonEnumerable: boolean,
): PropertyKey[] | undefined {
    if (!isObjectLikeValue(value)) {
        return undefined;
    }
    return listObjectKeys(value, includeSymbols, includeNonEnumerable);
}
