import type { JSONValue } from "../types/json-value.types.js";
import {
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import {
    cloneJSONData,
    isJSONData,
    jsonDataAreEqual,
} from "../utils/json-data.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { CreateJSONMergePatchParams } from "./create-json-merge-patch.types.js";

/**
 * Builds an RFC 7396 JSON Merge Patch from `first` to `second`.
 *
 * When both values are plain objects, the result is an object. Keys only in
 * `first` become `null`. Keys only in `second` are copied. Keys in both whose
 * values are both plain objects are compared again. Any other changed value
 * is the second value. Unchanged keys are omitted. An empty object means
 * nothing changed.
 *
 * When they are not both plain objects, the result is `second` when `second`
 * is JSON, and `undefined` otherwise. Arrays are not merged; the second array
 * replaces the first. `null` in a document is a JSON value. `null` inside the
 * patch this function returns still means "remove" when it is applied, which
 * is the RFC 7396 limit: a merge patch cannot store a JSON `null`.
 *
 * A change that would have to copy a non-JSON value returns `undefined`.
 * The result is a clone.
 *
 * @param params - The two documents.
 * @returns The merge patch, or `undefined` when `second` is not JSON.
 * @throws {TypeError} When `params` is not a plain object.
 * @example
 * createJSONMergePatch({ first: { a: 1, b: 2 }, second: { b: 2, c: 3 } });
 */
export function createJSONMergePatch(
    params: CreateJSONMergePatchParams,
): JSONValue | undefined {
    if (!isPlainObjectValue(params)) {
        throw new TypeError(
            `\`params\` must be a plain object; received ${describeReceived(params)}.`,
        );
    }
    return diffMerge(params.first, params.second);
}

/**
 * Builds the merge patch for one pair.
 *
 * @param first - The current value.
 * @param second - The desired value.
 * @returns The patch, or `undefined` when it cannot be represented as JSON.
 */
function diffMerge(first: unknown, second: unknown): JSONValue | undefined {
    if (isPlainObjectValue(first) && isPlainObjectValue(second)) {
        return diffObjects(first, second);
    }
    if (!isJSONData(second)) {
        return undefined;
    }
    return cloneJSONData(second) as JSONValue;
}

/**
 * Builds the object patch for two plain objects.
 *
 * @param first - The current object.
 * @param second - The desired object.
 * @returns The patch object, or `undefined` when a changed value is not JSON.
 */
function diffObjects(first: object, second: object): JSONValue | undefined {
    const patch: Record<string, JSONValue> = {};
    for (const key of Object.keys(first)) {
        if (!Object.hasOwn(second, key)) {
            writeOwnProperty(patch, key, null, "keep");
        }
    }
    for (const key of Object.keys(second)) {
        const right = readOwnProperty(second, key);
        if (!Object.hasOwn(first, key)) {
            const copied = copyJSON(right);
            if (copied === undefined) {
                return undefined;
            }
            writeOwnProperty(patch, key, copied, "keep");
            continue;
        }
        const left = readOwnProperty(first, key);
        if (isPlainObjectValue(left) && isPlainObjectValue(right)) {
            const child = diffObjects(left, right);
            if (child === undefined) {
                return undefined;
            }
            if (isPlainObjectValue(child) && Object.keys(child).length === 0) {
                continue;
            }
            writeOwnProperty(patch, key, child, "keep");
            continue;
        }
        if (jsonDataAreEqual(left, right)) {
            continue;
        }
        const copied = copyJSON(right);
        if (copied === undefined) {
            return undefined;
        }
        writeOwnProperty(patch, key, copied, "keep");
    }
    return patch;
}

/**
 * Clones `value` when it is JSON.
 *
 * @param value - A candidate JSON value.
 * @returns The clone, or `undefined` when `value` is not JSON.
 */
function copyJSON(value: unknown): JSONValue | undefined {
    if (!isJSONData(value)) {
        return undefined;
    }
    return cloneJSONData(value) as JSONValue;
}
