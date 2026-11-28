import { cloneDeepValue } from "../utils/clone.utils.js";
import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { SanitizeObjectParams } from "./sanitize-object.types.js";

const sanitizeFields = ["object", "deep"] as const;

/**
 * Copies `object` and drops `__proto__`, `prototype`, and `constructor`.
 *
 * Pass an object, or `{ object, deep }`. `deep` uses `cloneDeepValue` with
 * prototypes stripped and dangerous keys skipped. Cycles are preserved on
 * the clone. A shallow copy drops dangerous keys at the top level only.
 * The input is not mutated.
 *
 * @param object - The value to copy.
 * @returns The copy, or `undefined` when the value is not object-like.
 * @example
 * sanitizeObject({ id: 1 });
 */
/**
 * @param params - The object and the depth flag.
 */
export function sanitizeObject(
    params: SanitizeObjectParams,
): object | undefined;
/**
 * @param object - The value to copy.
 */
export function sanitizeObject(object: unknown): object | undefined;
/**
 * @param objectOrParams - An object or the options object.
 */
export function sanitizeObject(objectOrParams: unknown): object | undefined {
    const resolved = resolveSanitize(objectOrParams);
    if (!isObjectLikeValue(resolved.object)) {
        return undefined;
    }
    if (!resolved.deep) {
        const shallow = sanitizeShallow(resolved.object);
        return shallow;
    }
    const cloned = cloneDeepValue(resolved.object, {
        circular: "preserve",
        prototypeKeys: "skip",
        prototypes: "strip",
    });
    if (!isObjectLikeValue(cloned)) {
        return undefined;
    }
    return cloned;
}

/**
 * Reads a bare object or the options object.
 *
 * @param objectOrParams - The argument passed to `sanitizeObject`.
 * @returns The object and whether the copy is deep.
 */
function resolveSanitize(objectOrParams: unknown): {
    deep: boolean;
    object: unknown;
} {
    if (isParameterRecord(objectOrParams, "object", sanitizeFields)) {
        return {
            deep: objectOrParams.deep !== false,
            object: objectOrParams.object,
        };
    }
    return { deep: true, object: objectOrParams };
}

/**
 * Copies one level and drops dangerous keys.
 *
 * Arrays are sliced. Other objects copy own enumerable string keys onto a
 * plain object. A null prototype stays null. A class instance becomes plain.
 *
 * @param value - An object-like value.
 * @returns The shallow copy.
 */
function sanitizeShallow(value: object): object {
    if (Array.isArray(value)) {
        return value.slice();
    }
    const source = isPlainObjectValue(value) ? value : undefined;
    const target = createDictionary(source);
    for (const key of Object.keys(value)) {
        writeOwnProperty(target, key, readOwnProperty(value, key), "skip");
    }
    return target;
}
