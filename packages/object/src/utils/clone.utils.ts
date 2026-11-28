import { circularMarker } from "../constants/object-options.constants.js";
import type {
    CircularPolicy,
    PrototypeKeys,
    PrototypePolicy,
} from "../types/object-config.types.js";
import type { PathSegment } from "../types/path.types.js";
import { createDictionary, writeOwnProperty } from "./dangerous-key.utils.js";
import {
    isArrayBufferValue,
    isDataViewValue,
    isDateValue,
    isErrorValue,
    isMapValue,
    isObjectLikeValue,
    isPlainObjectValue,
    isRegExpValue,
    isSetValue,
    isTypedArrayValue,
    isURLSearchParamsValue,
    isURLValue,
    isWeakMapValue,
    isWeakSetValue,
} from "./value-kind.utils.js";

/**
 * Details passed to a `cloneDeepWith` customizer.
 */
export interface CloneVisit {
    /** The value about to be cloned. */
    value: unknown;
    /** The key or index that led here. Omitted at the root. */
    key?: PropertyKey;
    /** The path from the root. */
    path: PathSegment[];
    /** The parent container. Omitted at the root. */
    parent?: unknown;
}

/**
 * Options for {@link cloneDeepValue}.
 */
export interface CloneDeepOptions {
    /** What to do when a value points at an ancestor. */
    circular: CircularPolicy;
    /** How to copy a class instance. */
    prototypes: PrototypePolicy;
    /** How to copy dangerous keys. `"skip"` drops them. */
    prototypeKeys: PrototypeKeys;
    /** When set, called before the default clone of each value. */
    customizer?: (details: CloneVisit) => unknown;
    /** Return value that means "use the default clone". */
    continueSentinel?: unknown;
}

interface CloneFrame {
    ancestors: Set<object>;
    clones: WeakMap<object, unknown>;
    key: PropertyKey | undefined;
    parent: unknown;
    path: PathSegment[];
}

/**
 * A shallow copy of `value`.
 *
 * Primitives, functions, `WeakMap`, and `WeakSet` are returned as-is.
 * Containers are new instances. Nested values are shared. Dangerous own keys
 * are copied with `Object.defineProperty`.
 *
 * @param value - The value to copy.
 * @returns The copy, or `value` when there is nothing to copy.
 */
export function cloneShallowValue<T>(value: T): T {
    if (
        !isObjectLikeValue(value) ||
        isWeakMapValue(value) ||
        isWeakSetValue(value)
    ) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.slice() as T;
    }
    const leaf = cloneLeaf(value);
    if (leaf !== undefined) {
        return leaf as T;
    }
    const target = createDictionary(value);
    for (const key of Object.keys(value)) {
        writeOwnProperty(
            target,
            key,
            (value as Record<string, unknown>)[key],
            "keep",
        );
    }
    return target as T;
}

/**
 * A deep copy of `value`.
 *
 * The clone is registered before its children are copied, so a cycle points
 * at the cloned node when `circular` is `"preserve"`. Shared references that
 * are not cycles stay shared. Functions, symbols, `WeakMap`, and `WeakSet`
 * are copied by reference.
 *
 * @param value - The value to copy.
 * @param options - Clone policies.
 * @returns The copy.
 * @throws {RangeError} When `circular` is `"throw"` and a cycle is found.
 */
export function cloneDeepValue(
    value: unknown,
    options: CloneDeepOptions,
): unknown {
    return cloneNode(value, options, {
        ancestors: new Set(),
        clones: new WeakMap(),
        key: undefined,
        parent: undefined,
        path: [],
    });
}

/**
 * Clones one node.
 *
 * @param value - The current value.
 * @param options - Clone policies.
 * @param frame - Cycle state and the path to this node.
 * @returns The cloned node.
 * @throws {RangeError} When a cycle is rejected.
 */
function cloneNode(
    value: unknown,
    options: CloneDeepOptions,
    frame: CloneFrame,
): unknown {
    if (options.customizer !== undefined) {
        const details: CloneVisit = { path: frame.path, value };
        if (frame.key !== undefined) {
            details.key = frame.key;
        }
        if (frame.parent !== undefined) {
            details.parent = frame.parent;
        }
        const custom = options.customizer(details);
        if (custom !== options.continueSentinel) {
            return custom;
        }
    }
    if (!isObjectLikeValue(value)) {
        return value;
    }
    if (isWeakMapValue(value) || isWeakSetValue(value)) {
        return value;
    }
    if (frame.ancestors.has(value)) {
        return cyclingValue(value, options.circular, frame);
    }
    if (frame.clones.has(value)) {
        return frame.clones.get(value);
    }
    const leaf = cloneLeaf(value);
    if (leaf !== undefined) {
        frame.clones.set(value, leaf);
        return leaf;
    }
    if (Array.isArray(value)) {
        return cloneArray(value, options, frame);
    }
    if (isMapValue(value)) {
        return cloneMap(value, options, frame);
    }
    if (isSetValue(value)) {
        return cloneSet(value, options, frame);
    }
    if (isErrorValue(value)) {
        return cloneError(value, options, frame);
    }
    return cloneRecord(value, options, frame);
}

/**
 * Copies a built-in that does not contain object children.
 *
 * @param value - A non-null object.
 * @returns The copy, or `undefined` when `value` is a record, array, map, set, or error.
 */
function cloneLeaf(value: object): unknown {
    if (isDateValue(value)) {
        return new Date(value.getTime());
    }
    if (isRegExpValue(value)) {
        const cloned = new RegExp(value.source, value.flags);
        cloned.lastIndex = value.lastIndex;
        return cloned;
    }
    if (isArrayBufferValue(value)) {
        return value.slice(0);
    }
    if (isDataViewValue(value)) {
        const copy = new ArrayBuffer(value.byteLength);
        new Uint8Array(copy).set(
            new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
        );
        return new DataView(copy);
    }
    if (isTypedArrayValue(value)) {
        const constructor = value.constructor;
        if (typeof constructor === "function") {
            const TypedArray = constructor as new (
                entries: ArrayBufferView,
            ) => Exclude<ArrayBufferView, DataView>;
            return new TypedArray(value);
        }
        return value;
    }
    if (isURLValue(value)) {
        return new URL(value.href);
    }
    if (isURLSearchParamsValue(value)) {
        return new URLSearchParams(value);
    }
    return undefined;
}

/**
 * The clone to use when `value` points at an ancestor.
 *
 * `"preserve"` returns the clone already registered for that ancestor.
 *
 * @param value - The cycling object.
 * @param circular - The cycle policy.
 * @param frame - Cycle state. `value` is already in `ancestors`.
 * @returns The edge value.
 * @throws {RangeError} When `circular` is `"throw"`.
 */
function cyclingValue(
    value: object,
    circular: CircularPolicy,
    frame: CloneFrame,
): unknown {
    if (circular === "throw") {
        throw new RangeError(
            "`circular` blocked a cycle. The value points at an ancestor.",
        );
    }
    if (circular === "replace") {
        return circularMarker;
    }
    if (circular === "skip") {
        return undefined;
    }
    return frame.clones.get(value);
}

/**
 * Clones a child and extends the path when the key is a string or number.
 *
 * @param child - The child value.
 * @param key - The key or index that selected the child.
 * @param parent - The parent container.
 * @param options - Clone policies.
 * @param frame - The parent frame.
 * @returns The cloned child.
 */
function cloneChild(
    child: unknown,
    key: PropertyKey,
    parent: object,
    options: CloneDeepOptions,
    frame: CloneFrame,
): unknown {
    const path =
        typeof key === "string" || typeof key === "number"
            ? [...frame.path, key]
            : frame.path;
    return cloneNode(child, options, {
        ancestors: frame.ancestors,
        clones: frame.clones,
        key,
        parent,
        path,
    });
}

/**
 * Deep-copies an array, preserving holes.
 *
 * @param value - The source array.
 * @param options - Clone policies.
 * @param frame - Cycle state.
 * @returns A new array.
 */
function cloneArray(
    value: unknown[],
    options: CloneDeepOptions,
    frame: CloneFrame,
): unknown[] {
    const cloned: unknown[] = [];
    frame.clones.set(value, cloned);
    frame.ancestors.add(value);
    for (let index = 0; index < value.length; index += 1) {
        if (!Object.hasOwn(value, index)) {
            continue;
        }
        cloned[index] = cloneChild(value[index], index, value, options, frame);
    }
    frame.ancestors.delete(value);
    return cloned;
}

/**
 * Deep-copies a map.
 *
 * @param value - The source map.
 * @param options - Clone policies.
 * @param frame - Cycle state.
 * @returns A new map.
 */
function cloneMap(
    value: Map<unknown, unknown>,
    options: CloneDeepOptions,
    frame: CloneFrame,
): Map<unknown, unknown> {
    const cloned = new Map<unknown, unknown>();
    frame.clones.set(value, cloned);
    frame.ancestors.add(value);
    for (const [key, entry] of value) {
        cloned.set(
            cloneChild(key, key as PropertyKey, value, options, frame),
            cloneChild(entry, key as PropertyKey, value, options, frame),
        );
    }
    frame.ancestors.delete(value);
    return cloned;
}

/**
 * Deep-copies a set.
 *
 * @param value - The source set.
 * @param options - Clone policies.
 * @param frame - Cycle state.
 * @returns A new set.
 */
function cloneSet(
    value: Set<unknown>,
    options: CloneDeepOptions,
    frame: CloneFrame,
): Set<unknown> {
    const cloned = new Set<unknown>();
    frame.clones.set(value, cloned);
    frame.ancestors.add(value);
    let index = 0;
    for (const entry of value) {
        cloned.add(cloneChild(entry, index, value, options, frame));
        index += 1;
    }
    frame.ancestors.delete(value);
    return cloned;
}

/**
 * Deep-copies an error's name, message, cause, and own enumerable properties.
 *
 * @param value - The source error.
 * @param options - Clone policies.
 * @param frame - Cycle state.
 * @returns A new error.
 */
function cloneError(
    value: Error,
    options: CloneDeepOptions,
    frame: CloneFrame,
): Error {
    const cloned = new Error(value.message);
    cloned.name = value.name;
    if (typeof value.stack === "string") {
        cloned.stack = value.stack;
    }
    frame.clones.set(value, cloned);
    frame.ancestors.add(value);
    if (Object.hasOwn(value, "cause")) {
        cloned.cause = cloneChild(
            (value as { cause?: unknown }).cause,
            "cause",
            value,
            options,
            frame,
        );
    }
    for (const key of Object.keys(value)) {
        writeOwnProperty(
            cloned,
            key,
            cloneChild(
                (value as unknown as Record<string, unknown>)[key],
                key,
                value,
                options,
                frame,
            ),
            options.prototypeKeys,
        );
    }
    frame.ancestors.delete(value);
    return cloned;
}

/**
 * Deep-copies a plain object or a class instance.
 *
 * `"strip"` and plain objects use an ordinary object. A null prototype stays
 * null. `"keep"` on a class instance uses the same prototype.
 *
 * @param value - The source record.
 * @param options - Clone policies.
 * @param frame - Cycle state.
 * @returns A new record.
 */
function cloneRecord(
    value: object,
    options: CloneDeepOptions,
    frame: CloneFrame,
): object {
    const target = recordTarget(value, options.prototypes);
    frame.clones.set(value, target);
    frame.ancestors.add(value);
    for (const key of Object.keys(value)) {
        writeOwnProperty(
            target,
            key,
            cloneChild(
                (value as Record<string, unknown>)[key],
                key,
                value,
                options,
                frame,
            ),
            options.prototypeKeys,
        );
    }
    frame.ancestors.delete(value);
    return target;
}

/**
 * The empty object that receives a record's properties.
 *
 * @param value - The source record.
 * @param prototypes - `"keep"` reuses a class prototype. Plain objects stay plain.
 * @returns An empty target.
 */
function recordTarget(value: object, prototypes: PrototypePolicy): object {
    if (Object.getPrototypeOf(value) === null) {
        return Object.create(null) as object;
    }
    if (prototypes === "keep" && !isPlainObjectValue(value)) {
        return Object.create(Object.getPrototypeOf(value)) as object;
    }
    return {};
}
