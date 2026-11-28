import type { PrototypeKeys } from "../types/object-config.types.js";
import type { PathSegment } from "../types/path.types.js";
import {
    copyEnumerableProperties,
    isDangerousKey,
    readOwnProperty,
    writeOwnProperty,
} from "./dangerous-key.utils.js";
import { arrayIndexFromSegment } from "./path-text.utils.js";
import {
    isBinaryContainer,
    isMapValue,
    isObjectLikeValue,
    isSetValue,
    isWeakMapValue,
    isWeakSetValue,
} from "./value-kind.utils.js";

/**
 * A path read.
 *
 * `found` is `false` when a segment is missing, the walk hits a primitive,
 * or a dangerous key is not kept.
 */
export interface PathLookup {
    found: boolean;
    value: unknown;
}

/**
 * An immutable path edit.
 *
 * `changed` is `false` when the result is the same reference as the input.
 */
export interface PathEdit {
    result: unknown;
    changed: boolean;
}

/**
 * Reads `segments` from `root`.
 *
 * Own properties are required unless `inherited` is true. A hole in a sparse
 * array is missing. Dangerous keys are missing unless `prototypeKeys` is
 * `"keep"`, and even then only an own data property matches.
 *
 * @param root - The value to read.
 * @param segments - Segments from the root. An empty list returns `root`.
 * @param inherited - When true, inherited properties count for ordinary keys.
 * @param prototypeKeys - How dangerous keys are read. `"throw"` is treated as `"skip"` because readers do not throw.
 * @returns Whether the path was found, and the value when it was.
 */
export function readPathSegments(
    root: unknown,
    segments: readonly PathSegment[],
    inherited: boolean,
    prototypeKeys: PrototypeKeys,
): PathLookup {
    let current = root;
    for (const segment of segments) {
        if (!isObjectLikeValue(current)) {
            return { found: false, value: undefined };
        }
        const step = readSegment(current, segment, inherited, prototypeKeys);
        if (!step.found) {
            return { found: false, value: undefined };
        }
        current = step.value;
    }
    return { found: true, value: current };
}

/**
 * Returns a new value with `value` stored at `segments`.
 *
 * Ancestors on the path are copied. Unchanged subtrees keep their references.
 * A missing parent is created: a following integer segment creates an array,
 * and any other segment creates an ordinary object. The input is not mutated.
 *
 * @param root - The value to copy. A primitive root is replaced when segments are non-empty.
 * @param segments - Segments from the root. An empty list returns `value`.
 * @param value - The value to store.
 * @param prototypeKeys - How dangerous keys are written.
 * @returns The edited value and whether it differs from `root`.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and a segment is dangerous.
 */
export function setPathSegments(
    root: unknown,
    segments: readonly PathSegment[],
    value: unknown,
    prototypeKeys: PrototypeKeys,
): PathEdit {
    return writeSegments(root, segments, 0, value, prototypeKeys, "set");
}

/**
 * Returns a new value with the last segment removed.
 *
 * When the parent is an array and the last segment is an index, the index is
 * spliced out and later items shift. A missing path returns `root`.
 *
 * @param root - The value to copy.
 * @param segments - Segments from the root.
 * @param prototypeKeys - How dangerous keys are treated.
 * @returns The edited value and whether it differs from `root`.
 * @throws {RangeError} When `prototypeKeys` is `"throw"` and a segment is dangerous.
 */
export function unsetPathSegments(
    root: unknown,
    segments: readonly PathSegment[],
    prototypeKeys: PrototypeKeys,
): PathEdit {
    if (segments.length === 0) {
        return { result: root, changed: false };
    }
    return writeSegments(root, segments, 0, undefined, prototypeKeys, "unset");
}

/**
 * Reads one segment.
 *
 * @param current - The parent value. It is object-like.
 * @param segment - The segment to read.
 * @param inherited - Whether ordinary inherited keys count.
 * @param prototypeKeys - How a dangerous key is read.
 * @returns The lookup for this segment.
 */
function readSegment(
    current: object,
    segment: PathSegment,
    inherited: boolean,
    prototypeKeys: PrototypeKeys,
): PathLookup {
    if (isDangerousKey(segment) && prototypeKeys !== "keep") {
        return { found: false, value: undefined };
    }
    const numericIndex = arrayIndexFromSegment(segment);
    if (Array.isArray(current) && numericIndex !== undefined) {
        if (!Object.hasOwn(current, numericIndex)) {
            return { found: false, value: undefined };
        }
        return { found: true, value: current[numericIndex] };
    }
    if (isDangerousKey(segment)) {
        if (!Object.hasOwn(current, segment)) {
            return { found: false, value: undefined };
        }
        return { found: true, value: readOwnProperty(current, segment) };
    }
    const present = inherited
        ? segment in current
        : Object.hasOwn(current, segment);
    if (!present) {
        return { found: false, value: undefined };
    }
    return {
        found: true,
        value: (current as Record<PropertyKey, unknown>)[segment],
    };
}

/**
 * Sets or unsets `segments` starting at `index`.
 *
 * @param current - The value at this level.
 * @param segments - The full segment list.
 * @param index - The segment to apply.
 * @param value - The value written by a set.
 * @param prototypeKeys - How dangerous keys are written.
 * @param mode - `"set"` writes `value`. `"unset"` removes the last segment.
 * @returns The edited value.
 * @throws {RangeError} When a dangerous key is rejected.
 */
function writeSegments(
    current: unknown,
    segments: readonly PathSegment[],
    index: number,
    value: unknown,
    prototypeKeys: PrototypeKeys,
    mode: "set" | "unset",
): PathEdit {
    if (index >= segments.length) {
        return { result: value, changed: !Object.is(current, value) };
    }
    const segment = segments[index];
    if (segment === undefined) {
        return { result: current, changed: false };
    }
    if (isDangerousKey(segment)) {
        if (prototypeKeys === "throw") {
            throw new RangeError(
                `\`prototypeKeys\` blocked the dangerous key "${String(segment)}".`,
            );
        }
        if (prototypeKeys === "skip") {
            return { result: current, changed: false };
        }
    }
    const isLast = index === segments.length - 1;
    const numericIndex = arrayIndexFromSegment(segment);
    if (Array.isArray(current) && numericIndex !== undefined) {
        return writeArrayIndex(
            current,
            segments,
            index,
            numericIndex,
            value,
            prototypeKeys,
            mode,
            isLast,
        );
    }
    if (isPropertyRecord(current)) {
        return writeObjectKey(
            current,
            segments,
            index,
            segment,
            value,
            prototypeKeys,
            mode,
            isLast,
        );
    }
    if (mode === "unset") {
        return { result: current, changed: false };
    }
    const created = numericIndex !== undefined ? [] : {};
    return writeSegments(created, segments, index, value, prototypeKeys, mode);
}

/**
 * Edits an array index.
 *
 * @param current - The parent array. It is not mutated.
 * @param segments - The full segment list.
 * @param index - The index of `numericIndex` in `segments`.
 * @param numericIndex - The array index to edit.
 * @param value - The value written by a set.
 * @param prototypeKeys - How dangerous keys are written below this index.
 * @param mode - `"set"` or `"unset"`.
 * @param isLast - Whether this segment is the last one.
 * @returns The edited array, or the same array when nothing changed.
 */
function writeArrayIndex(
    current: unknown[],
    segments: readonly PathSegment[],
    index: number,
    numericIndex: number,
    value: unknown,
    prototypeKeys: PrototypeKeys,
    mode: "set" | "unset",
    isLast: boolean,
): PathEdit {
    if (mode === "unset" && isLast) {
        if (numericIndex >= current.length) {
            return { result: current, changed: false };
        }
        const copy = current.slice();
        copy.splice(numericIndex, 1);
        return { result: copy, changed: true };
    }
    const hasIndex = Object.hasOwn(current, numericIndex);
    const childCurrent = hasIndex ? current[numericIndex] : undefined;
    const child = isLast
        ? {
              result: value,
              changed: !(hasIndex && Object.is(childCurrent, value)),
          }
        : writeSegments(
              childCurrent,
              segments,
              index + 1,
              value,
              prototypeKeys,
              mode,
          );
    if (!child.changed) {
        return { result: current, changed: false };
    }
    const copy = current.slice();
    copy[numericIndex] = child.result;
    return { result: copy, changed: true };
}

/**
 * Edits an object key.
 *
 * @param current - The parent object. It is not mutated.
 * @param segments - The full segment list.
 * @param index - The index of `segment` in `segments`.
 * @param segment - The key to edit.
 * @param value - The value written by a set.
 * @param prototypeKeys - How dangerous keys are written.
 * @param mode - `"set"` or `"unset"`.
 * @param isLast - Whether this segment is the last one.
 * @returns The edited object, or the same object when nothing changed.
 */
function writeObjectKey(
    current: object,
    segments: readonly PathSegment[],
    index: number,
    segment: PathSegment,
    value: unknown,
    prototypeKeys: PrototypeKeys,
    mode: "set" | "unset",
    isLast: boolean,
): PathEdit {
    const key = segment;
    const hasKey = Object.hasOwn(current, key);
    if (mode === "unset" && isLast) {
        if (!hasKey) {
            return { result: current, changed: false };
        }
        const copy = copyPropertyRecord(current, prototypeKeys);
        delete (copy as Record<PropertyKey, unknown>)[key];
        return { result: copy, changed: true };
    }
    const childCurrent = hasKey
        ? (current as Record<PropertyKey, unknown>)[key]
        : undefined;
    const child = isLast
        ? {
              result: value,
              changed: !(hasKey && Object.is(childCurrent, value)),
          }
        : writeSegments(
              childCurrent,
              segments,
              index + 1,
              value,
              prototypeKeys,
              mode,
          );
    if (!child.changed) {
        return { result: current, changed: false };
    }
    if (Array.isArray(current)) {
        const copy = current.slice();
        const written = writeOwnProperty(
            copy,
            key,
            child.result,
            prototypeKeys,
        );
        if (written === "skipped") {
            return { result: current, changed: false };
        }
        return { result: copy, changed: true };
    }
    const copy = copyPropertyRecord(current, prototypeKeys);
    const written = writeOwnProperty(copy, key, child.result, prototypeKeys);
    if (written === "skipped") {
        return { result: current, changed: false };
    }
    return { result: copy, changed: true };
}

/**
 * Whether `value` can hold string or symbol keys for a path edit.
 *
 * Maps, sets, and binary containers are replaced instead of copied, because a
 * path key is not a map key or a byte offset.
 *
 * @param value - Any value.
 * @returns `true` when the value's own properties can be copied.
 */
function isPropertyRecord(value: unknown): value is object {
    return (
        isObjectLikeValue(value) &&
        !isMapValue(value) &&
        !isSetValue(value) &&
        !isWeakMapValue(value) &&
        !isWeakSetValue(value) &&
        !isBinaryContainer(value)
    );
}

/**
 * Copies a property record for a path edit.
 *
 * Arrays are sliced. Other records copy own enumerable string keys.
 *
 * @param value - The record to copy.
 * @param prototypeKeys - How dangerous keys are copied.
 * @returns A new record.
 */
function copyPropertyRecord(
    value: object,
    prototypeKeys: PrototypeKeys,
): object {
    if (Array.isArray(value)) {
        return value.slice();
    }
    return copyEnumerableProperties(value, prototypeKeys);
}
