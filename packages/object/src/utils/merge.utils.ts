import type {
    ArrayMerge,
    CircularPolicy,
    PrototypeKeys,
} from "../types/object-config.types.js";
import type { PathSegment } from "../types/path.types.js";
import {
    createDictionary,
    isDangerousKey,
    writeOwnProperty,
} from "./dangerous-key.utils.js";
import { cloneDeepValue, cloneShallowValue } from "./clone.utils.js";
import { isObjectLikeValue, isPlainObjectValue } from "./value-kind.utils.js";

/**
 * Details passed to a `mergeDeep` customizer.
 */
export interface MergeVisit {
    /** The key being merged. */
    key: PropertyKey;
    /** The current target value. */
    targetValue: unknown;
    /** The source value. */
    sourceValue: unknown;
    /** The path of this key, including the key. */
    path: PathSegment[];
}

/**
 * Options for {@link mergeDeepValues}.
 */
export interface MergeOptions {
    /** How arrays combine. */
    arrayMerge: ArrayMerge;
    /** How dangerous keys are written. */
    prototypeKeys: PrototypeKeys;
    /** How a cycle in the source is handled. */
    circular: CircularPolicy;
    /**
     * When this returns a value other than `undefined`, that value is used.
     * `undefined` means "use the default rule".
     */
    customizer?: (details: MergeVisit) => unknown;
}

/**
 * Options for {@link defaultsDeepValues}.
 */
export interface DefaultsOptions {
    /** How arrays combine when both sides are arrays. */
    arrayMerge: ArrayMerge;
    /** How dangerous keys are written. */
    prototypeKeys: PrototypeKeys;
}

/**
 * Merges plain objects and arrays from left to right.
 *
 * The inputs are not mutated. Unchanged nested values keep their references.
 * A non-object item is ignored. When nothing is object-like, the result is `{}`.
 *
 * @param objects - Values to merge. The caller has already checked that this is an array.
 * @param options - Merge policies.
 * @returns A new object or array.
 * @throws {RangeError} When a cycle or a dangerous key is rejected.
 */
export function mergeDeepValues(
    objects: readonly unknown[],
    options: MergeOptions,
): object {
    let result: unknown;
    let started = false;
    for (const item of objects) {
        if (!isObjectLikeValue(item)) {
            continue;
        }
        if (!started) {
            result = cloneShallowValue(item);
            started = true;
            continue;
        }
        result = mergePair(result, item, options, [], new WeakMap());
    }
    if (!started || !isObjectLikeValue(result)) {
        return {};
    }
    return result;
}

/**
 * Fills keys that are missing or `undefined`.
 *
 * A present `null`, `0`, or `""` is kept. The inputs are not mutated.
 *
 * @param object - The source of truth.
 * @param sources - Default objects, already flattened to a list.
 * @param options - Defaults policies.
 * @returns A new object.
 * @throws {RangeError} When a dangerous key is rejected.
 */
export function defaultsDeepValues(
    object: object,
    sources: readonly unknown[],
    options: DefaultsOptions,
): object {
    let result: object = cloneShallowValue(object);
    for (const source of sources) {
        if (!isObjectLikeValue(source)) {
            continue;
        }
        const filled = fillPair(result, source, options, []);
        if (isObjectLikeValue(filled)) {
            result = filled;
        }
    }
    return result;
}

/**
 * Merges `source` onto `target`.
 *
 * @param target - The current result.
 * @param source - The next value.
 * @param options - Merge policies.
 * @param path - The path of `target`.
 * @param seen - Source objects already merged, for cycles and shared references.
 * @returns The merged value.
 */
function mergePair(
    target: unknown,
    source: unknown,
    options: MergeOptions,
    path: PathSegment[],
    seen: WeakMap<object, unknown>,
): unknown {
    if (Array.isArray(target) && Array.isArray(source)) {
        return mergeArrays(target, source, options, path, seen);
    }
    if (!isPlainObjectValue(target) || !isPlainObjectValue(source)) {
        return cloneDeepValue(source, {
            circular: options.circular,
            prototypeKeys: options.prototypeKeys,
            prototypes: "strip",
        });
    }
    if (seen.has(source)) {
        if (options.circular === "throw") {
            throw new RangeError(
                "`circular` blocked a cycle while merging. The source points at an ancestor.",
            );
        }
        if (options.circular === "skip") {
            return target;
        }
        return seen.get(source);
    }
    const merged = createDictionary(target);
    seen.set(source, merged);
    const keys = new Set([...Object.keys(target), ...Object.keys(source)]);
    for (const key of keys) {
        if (isDangerousKey(key) && options.prototypeKeys === "skip") {
            continue;
        }
        const hasTarget = Object.hasOwn(target, key);
        const hasSource = Object.hasOwn(source, key);
        if (!hasSource) {
            writeOwnProperty(merged, key, target[key], options.prototypeKeys);
            continue;
        }
        const sourceValue = source[key];
        const targetValue = hasTarget ? target[key] : undefined;
        const nextPath = [...path, key];
        if (options.customizer !== undefined && hasTarget) {
            const custom = options.customizer({
                key,
                path: nextPath,
                sourceValue,
                targetValue,
            });
            if (custom !== undefined) {
                writeOwnProperty(merged, key, custom, options.prototypeKeys);
                continue;
            }
        }
        const child = hasTarget
            ? mergePair(targetValue, sourceValue, options, nextPath, seen)
            : cloneDeepValue(sourceValue, {
                  circular: options.circular,
                  prototypeKeys: options.prototypeKeys,
                  prototypes: "strip",
              });
        writeOwnProperty(merged, key, child, options.prototypeKeys);
    }
    return merged;
}

/**
 * Merges two arrays.
 *
 * `"replace"` clones `source`. `"concat"` appends a clone of `source` after
 * `target`. `"index"` merges plain objects at the same index and appends
 * extra source elements. A hole in `source` keeps the target element.
 *
 * @param target - The current array.
 * @param source - The incoming array.
 * @param options - Merge policies.
 * @param path - The path of the array.
 * @param seen - Cycle map.
 * @returns A new array.
 */
function mergeArrays(
    target: unknown[],
    source: unknown[],
    options: MergeOptions,
    path: PathSegment[],
    seen: WeakMap<object, unknown>,
): unknown[] {
    if (options.arrayMerge === "replace") {
        const replaced = cloneDeepValue(source, {
            circular: options.circular,
            prototypeKeys: options.prototypeKeys,
            prototypes: "strip",
        });
        return Array.isArray(replaced) ? replaced : [];
    }
    if (options.arrayMerge === "concat") {
        const appended = cloneDeepValue(source, {
            circular: options.circular,
            prototypeKeys: options.prototypeKeys,
            prototypes: "strip",
        });
        return target.concat(Array.isArray(appended) ? appended : []);
    }
    const length = Math.max(target.length, source.length);
    const merged: unknown[] = [];
    for (let index = 0; index < length; index += 1) {
        const hasTarget = index < target.length && Object.hasOwn(target, index);
        const hasSource = index < source.length && Object.hasOwn(source, index);
        if (!hasSource) {
            if (hasTarget) {
                merged[index] = target[index];
            }
            continue;
        }
        if (!hasTarget) {
            merged[index] = cloneDeepValue(source[index], {
                circular: options.circular,
                prototypeKeys: options.prototypeKeys,
                prototypes: "strip",
            });
            continue;
        }
        merged[index] = mergePair(
            target[index],
            source[index],
            options,
            [...path, index],
            seen,
        );
    }
    return merged;
}

/**
 * Fills `target` from `source` without overwriting defined values.
 *
 * @param target - The current result.
 * @param source - A defaults object.
 * @param options - Defaults policies.
 * @param path - The path of `target`.
 * @returns The filled value.
 */
function fillPair(
    target: unknown,
    source: unknown,
    options: DefaultsOptions,
    path: PathSegment[],
): unknown {
    if (Array.isArray(target) && Array.isArray(source)) {
        return fillArrays(target, source, options, path);
    }
    if (!isPlainObjectValue(target) || !isPlainObjectValue(source)) {
        return target === undefined ? cloneShallowValue(source) : target;
    }
    const filled = createDictionary(target);
    for (const key of Object.keys(target)) {
        writeOwnProperty(filled, key, target[key], options.prototypeKeys);
    }
    for (const key of Object.keys(source)) {
        if (isDangerousKey(key) && options.prototypeKeys === "skip") {
            continue;
        }
        const hasTarget = Object.hasOwn(target, key);
        const targetValue = hasTarget ? target[key] : undefined;
        if (!hasTarget || targetValue === undefined) {
            writeOwnProperty(
                filled,
                key,
                cloneDeepValue(source[key], {
                    circular: "preserve",
                    prototypeKeys: options.prototypeKeys,
                    prototypes: "strip",
                }),
                options.prototypeKeys,
            );
            continue;
        }
        if (
            isPlainObjectValue(targetValue) &&
            isPlainObjectValue(source[key])
        ) {
            writeOwnProperty(
                filled,
                key,
                fillPair(targetValue, source[key], options, [...path, key]),
                options.prototypeKeys,
            );
            continue;
        }
        if (Array.isArray(targetValue) && Array.isArray(source[key])) {
            writeOwnProperty(
                filled,
                key,
                fillArrays(targetValue, source[key], options, [...path, key]),
                options.prototypeKeys,
            );
        }
    }
    return filled;
}

/**
 * Fills array elements that are missing or `undefined`.
 *
 * `"replace"` keeps the target array, because it is already present.
 * `"concat"` appends a clone of the source. `"index"` fills holes and merges
 * plain-object elements.
 *
 * @param target - The current array.
 * @param source - The defaults array.
 * @param options - Defaults policies.
 * @param path - The path of the array.
 * @returns A new array, or `target` when `"replace"` keeps it.
 */
function fillArrays(
    target: unknown[],
    source: unknown[],
    options: DefaultsOptions,
    path: PathSegment[],
): unknown[] {
    if (options.arrayMerge === "replace") {
        return target;
    }
    if (options.arrayMerge === "concat") {
        const appended = cloneDeepValue(source, {
            circular: "preserve",
            prototypeKeys: options.prototypeKeys,
            prototypes: "strip",
        });
        return target.concat(Array.isArray(appended) ? appended : []);
    }
    const length = Math.max(target.length, source.length);
    const filled: unknown[] = [];
    for (let index = 0; index < length; index += 1) {
        const hasTarget = index < target.length && Object.hasOwn(target, index);
        const hasSource = index < source.length && Object.hasOwn(source, index);
        const targetValue = hasTarget ? target[index] : undefined;
        if (hasTarget && targetValue !== undefined && hasSource) {
            const sourceValue = source[index];
            if (
                isPlainObjectValue(targetValue) &&
                isPlainObjectValue(sourceValue)
            ) {
                filled[index] = fillPair(targetValue, sourceValue, options, [
                    ...path,
                    index,
                ]);
                continue;
            }
            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                filled[index] = fillArrays(targetValue, sourceValue, options, [
                    ...path,
                    index,
                ]);
                continue;
            }
        }
        if (hasTarget && targetValue !== undefined) {
            filled[index] = targetValue;
            continue;
        }
        if (hasSource) {
            filled[index] = cloneDeepValue(source[index], {
                circular: "preserve",
                prototypeKeys: options.prototypeKeys,
                prototypes: "strip",
            });
        }
    }
    return filled;
}
