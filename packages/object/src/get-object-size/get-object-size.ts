import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { listObjectKeys } from "../utils/object-keys.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { GetObjectSizeParams } from "./get-object-size.types.js";

const sizeFields = ["object", "deep", "includeSymbols"] as const;

/**
 * Counts own enumerable keys.
 *
 * Pass an object for a shallow string-key count. Pass
 * `{ object, deep, includeSymbols }` to include nested plain objects and
 * arrays, or symbol keys. Nested nodes are counted once. A non-object
 * returns `undefined`.
 *
 * @param object - An object, or the options object.
 * @returns The key count, or `undefined` when the value is not object-like.
 * @example
 * getObjectSize({ id: 1, name: "Ada" });
 */
export function getObjectSize(object: unknown): number | undefined;
/**
 * @param params - The object and count options.
 */
export function getObjectSize(params: GetObjectSizeParams): number | undefined;
/**
 * @param objectOrParams - An object or the options object.
 */
export function getObjectSize(objectOrParams: unknown): number | undefined {
    const resolved = resolveSize(objectOrParams);
    if (!isObjectLikeValue(resolved.object)) {
        return undefined;
    }
    return countKeys(
        resolved.object,
        resolved.deep === true,
        resolved.includeSymbols === true,
        new Set(),
    );
}

/**
 * Reads the size argument.
 *
 * @param objectOrParams - An object or the options object.
 * @returns A normalized parameter object. The object field may still be a non-object.
 */
function resolveSize(objectOrParams: unknown): GetObjectSizeParams {
    if (isParameterRecord(objectOrParams, "object", sizeFields)) {
        return {
            deep: objectOrParams.deep === true,
            includeSymbols: objectOrParams.includeSymbols === true,
            object: objectOrParams.object,
        };
    }
    return { object: objectOrParams };
}

/**
 * Counts keys at `value` and, when requested, inside nested containers.
 *
 * @param value - The current object.
 * @param deep - Whether to walk nested plain objects and arrays.
 * @param includeSymbols - Whether symbol keys count.
 * @param seen - Objects already counted.
 * @returns The key count for this node and its children.
 */
function countKeys(
    value: object,
    deep: boolean,
    includeSymbols: boolean,
    seen: Set<object>,
): number {
    if (seen.has(value)) {
        return 0;
    }
    seen.add(value);
    const keys = listObjectKeys(value, includeSymbols, false);
    let count = keys.length;
    if (!deep) {
        return count;
    }
    const children = Array.isArray(value)
        ? value
        : isPlainObjectValue(value)
          ? Object.values(value)
          : [];
    for (const child of children) {
        if (isPlainObjectValue(child) || Array.isArray(child)) {
            count += countKeys(child, true, includeSymbols, seen);
        }
    }
    return count;
}
