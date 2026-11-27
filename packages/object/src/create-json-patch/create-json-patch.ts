import type { JSONPatchOperation } from "../types/json-patch.types.js";
import type { PathSegment } from "../types/path.types.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import {
    cloneJSONData,
    containsCycle,
    jsonDataAreEqual,
} from "../utils/json-data.utils.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { formatJSONPointerText } from "../utils/path-text.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { CreateJSONPatchParams } from "./create-json-patch.types.js";

/**
 * Builds an RFC 6902 patch that turns `first` into `second`.
 *
 * Equal values return `[]`. Arrays are compared by index: shared indexes are
 * patched in place, extra indexes are removed from the end, and new indexes
 * are added at the end. Objects are compared by key. Nested arrays and plain
 * objects are patched inside their path. Any other difference is a
 * `"replace"`. `"move"` and `"copy"` are never emitted. `applyJSONPatch`
 * still accepts `"move"`.
 *
 * A cycle that is not equal to the other value becomes one `"replace"` at
 * `""`, because a pointer walk cannot name the cycle. The patch stores clones
 * of the inserted values.
 *
 * @param params - The two documents.
 * @returns Operations that turn `first` into `second`.
 * @throws {TypeError} When `params` is not a plain object.
 * @example
 * createJSONPatch({ first: { a: 1 }, second: { a: 2, b: 3 } });
 */
export function createJSONPatch(
    params: CreateJSONPatchParams,
): JSONPatchOperation[] {
    if (!isPlainObjectValue(params)) {
        throw new TypeError(
            `\`params\` must be a plain object; received ${describeReceived(params)}.`,
        );
    }
    if (jsonDataAreEqual(params.first, params.second)) {
        return [];
    }
    if (containsCycle(params.first) || containsCycle(params.second)) {
        return [replaceOperation([], params.second)];
    }
    const operations: JSONPatchOperation[] = [];
    diffNode(params.first, params.second, [], operations);
    return operations;
}

/**
 * Appends the patch from `first` to `second` at `segments`.
 *
 * @param first - The current value.
 * @param second - The desired value.
 * @param segments - The pointer to this pair.
 * @param operations - The patch being built.
 */
function diffNode(
    first: unknown,
    second: unknown,
    segments: PathSegment[],
    operations: JSONPatchOperation[],
): void {
    if (jsonDataAreEqual(first, second)) {
        return;
    }
    if (Array.isArray(first) && Array.isArray(second)) {
        diffArray(first, second, segments, operations);
        return;
    }
    if (isPlainObjectValue(first) && isPlainObjectValue(second)) {
        diffObject(first, second, segments, operations);
        return;
    }
    operations.push(replaceOperation(segments, second));
}

/**
 * Compares two arrays by index.
 *
 * Removes are emitted from the last extra index backward so earlier indexes
 * stay valid when the patch is applied. Adds use the index after those
 * removes.
 *
 * @param first - The current array.
 * @param second - The desired array.
 * @param segments - The pointer to this array.
 * @param operations - The patch being built.
 */
function diffArray(
    first: readonly unknown[],
    second: readonly unknown[],
    segments: readonly PathSegment[],
    operations: JSONPatchOperation[],
): void {
    const shared = Math.min(first.length, second.length);
    for (let index = 0; index < shared; index += 1) {
        diffNode(first[index], second[index], [...segments, index], operations);
    }
    for (let index = first.length - 1; index >= second.length; index -= 1) {
        operations.push(removeOperation([...segments, index]));
    }
    for (let index = first.length; index < second.length; index += 1) {
        operations.push(addOperation([...segments, index], second[index]));
    }
}

/**
 * Compares two plain objects by own enumerable key.
 *
 * Keys only in `first` are removed. Keys only in `second` are added. Keys
 * in both are compared. Dangerous keys are read as own data.
 *
 * @param first - The current object.
 * @param second - The desired object.
 * @param segments - The pointer to this object.
 * @param operations - The patch being built.
 */
function diffObject(
    first: object,
    second: object,
    segments: readonly PathSegment[],
    operations: JSONPatchOperation[],
): void {
    for (const key of Object.keys(first)) {
        if (!Object.hasOwn(second, key)) {
            operations.push(removeOperation([...segments, key]));
            continue;
        }
        diffNode(
            readOwnProperty(first, key),
            readOwnProperty(second, key),
            [...segments, key],
            operations,
        );
    }
    for (const key of Object.keys(second)) {
        if (Object.hasOwn(first, key)) {
            continue;
        }
        operations.push(
            addOperation([...segments, key], readOwnProperty(second, key)),
        );
    }
}

/**
 * A `"replace"` operation at `segments`.
 *
 * @param segments - The pointer segments.
 * @param value - The replacement value. A clone is stored.
 * @returns The operation.
 */
function replaceOperation(
    segments: readonly PathSegment[],
    value: unknown,
): JSONPatchOperation {
    return {
        op: "replace",
        path: pointerFrom(segments),
        value: cloneJSONData(value),
    };
}

/**
 * An `"add"` operation at `segments`.
 *
 * @param segments - The pointer segments.
 * @param value - The value to add. A clone is stored.
 * @returns The operation.
 */
function addOperation(
    segments: readonly PathSegment[],
    value: unknown,
): JSONPatchOperation {
    return {
        op: "add",
        path: pointerFrom(segments),
        value: cloneJSONData(value),
    };
}

/**
 * A `"remove"` operation at `segments`.
 *
 * @param segments - The pointer segments.
 * @returns The operation.
 */
function removeOperation(segments: readonly PathSegment[]): JSONPatchOperation {
    return { op: "remove", path: pointerFrom(segments) };
}

/**
 * Formats `segments` as a JSON Pointer.
 *
 * The segments this file builds are strings and safe indexes, which always
 * format. The empty string is a fallback for a segment that cannot be
 * formatted.
 *
 * @param segments - Path segments.
 * @returns The pointer text.
 */
function pointerFrom(segments: readonly PathSegment[]): string {
    return formatJSONPointerText(segments) ?? "";
}
