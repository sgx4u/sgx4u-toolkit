import type { JSONValue } from "../types/json-value.types.js";
import { isJSONValue } from "../is-json-value/is-json-value.js";
import {
    createDictionary,
    readOwnProperty,
    writeOwnProperty,
} from "./dangerous-key.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
    valueTag,
} from "./value-kind.utils.js";

/**
 * Whether `value` is JSON data.
 *
 * `isJSONValue` rejects symbol keys on objects, cycles, holes, `NaN`,
 * infinities, bigints, functions, and `undefined`.
 *
 * @param value - Any value.
 * @returns `true` when `value` can be stored in JSON.
 */
export function isJSONData(value: unknown): value is JSONValue {
    return isJSONValue(value);
}

/**
 * Deep-clones JSON data and plain containers.
 *
 * Primitives are returned as-is. Arrays, plain objects, and dates are copied.
 * A cycle points at the copy already in progress. Class instances other than
 * `Date` are returned as the same reference. Dangerous own keys are copied
 * with `Object.defineProperty`, so the clone does not walk `Object.prototype`.
 *
 * @param value - The value to copy.
 * @returns The copy.
 */
export function cloneJSONData(value: unknown): unknown {
    return cloneNode(value, new WeakMap());
}

/**
 * Deep equality for the values JSON Patch and Merge Patch compare.
 *
 * `NaN` equals `NaN`. `+0` equals `-0`. Object key order does not matter.
 * Array order does. A cycle is compared by pairing each object once. Dates
 * compare by time value. Other non-plain objects compare by reference.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @returns `true` when the values match.
 */
export function jsonDataAreEqual(first: unknown, second: unknown): boolean {
    return valuesEqual(first, second, new WeakMap());
}

/**
 * Whether `value` points at one of its ancestors.
 *
 * @param value - Any value.
 * @returns `true` when a nested object points at an ancestor.
 */
export function containsCycle(value: unknown): boolean {
    return cycleNode(value, new Set());
}

/**
 * Copies one node.
 *
 * @param value - The current value.
 * @param seen - Clones already started, so a cycle can point at one.
 * @returns The copied node.
 */
function cloneNode(value: unknown, seen: WeakMap<object, unknown>): unknown {
    if (!isObjectLikeValue(value)) {
        return value;
    }
    const existing = seen.get(value);
    if (existing !== undefined) {
        return existing;
    }
    if (Array.isArray(value)) {
        const copy: unknown[] = [];
        seen.set(value, copy);
        for (let index = 0; index < value.length; index += 1) {
            if (!Object.hasOwn(value, index)) {
                continue;
            }
            copy[index] = cloneNode(value[index], seen);
        }
        return copy;
    }
    if (valueTag(value) === "[object Date]") {
        const copy = new Date((value as Date).getTime());
        seen.set(value, copy);
        return copy;
    }
    if (!isPlainObjectValue(value)) {
        return value;
    }
    const copy = createDictionary(value);
    seen.set(value, copy);
    for (const key of Object.keys(value)) {
        writeOwnProperty(
            copy,
            key,
            cloneNode(readOwnProperty(value, key), seen),
            "keep",
        );
    }
    return copy;
}

/**
 * Compares one pair.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param seen - Pairs already assumed equal while their children are compared.
 * @returns `true` when the pair matches.
 */
function valuesEqual(
    first: unknown,
    second: unknown,
    seen: WeakMap<object, WeakMap<object, true>>,
): boolean {
    if (first === second) {
        return true;
    }
    if (typeof first === "number" && typeof second === "number") {
        return Number.isNaN(first) && Number.isNaN(second);
    }
    if (isDate(first) && isDate(second)) {
        return first.getTime() === second.getTime();
    }
    if (!isObjectLikeValue(first) || !isObjectLikeValue(second)) {
        return false;
    }
    if (pairSeen(seen, first, second)) {
        return true;
    }
    if (Array.isArray(first) || Array.isArray(second)) {
        if (!Array.isArray(first) || !Array.isArray(second)) {
            return false;
        }
        return arraysEqual(first, second, seen);
    }
    if (!isPlainObjectValue(first) || !isPlainObjectValue(second)) {
        return false;
    }
    return objectsEqual(first, second, seen);
}

/**
 * Whether `value` is a `Date`.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a `Date`.
 */
function isDate(value: unknown): value is Date {
    return isObjectLikeValue(value) && valueTag(value) === "[object Date]";
}

/**
 * Records a pair and reports whether it is already being compared.
 *
 * @param seen - Pair map.
 * @param first - The left object.
 * @param second - The right object.
 * @returns `true` when this pair is already on the stack.
 */
function pairSeen(
    seen: WeakMap<object, WeakMap<object, true>>,
    first: object,
    second: object,
): boolean {
    let partners = seen.get(first);
    if (partners === undefined) {
        partners = new WeakMap();
        seen.set(first, partners);
    }
    if (partners.has(second)) {
        return true;
    }
    partners.set(second, true);
    return false;
}

/**
 * Whether two arrays have the same length, holes, and elements.
 *
 * @param first - The left array.
 * @param second - The right array.
 * @param seen - Pair map.
 * @returns `true` when the arrays match.
 */
function arraysEqual(
    first: readonly unknown[],
    second: readonly unknown[],
    seen: WeakMap<object, WeakMap<object, true>>,
): boolean {
    if (first.length !== second.length) {
        return false;
    }
    for (let index = 0; index < first.length; index += 1) {
        if (Object.hasOwn(first, index) !== Object.hasOwn(second, index)) {
            return false;
        }
        if (!valuesEqual(first[index], second[index], seen)) {
            return false;
        }
    }
    return true;
}

/**
 * Whether two plain objects have the same own enumerable keys and values.
 *
 * @param first - The left object.
 * @param second - The right object.
 * @param seen - Pair map.
 * @returns `true` when the objects match.
 */
function objectsEqual(
    first: object,
    second: object,
    seen: WeakMap<object, WeakMap<object, true>>,
): boolean {
    const firstKeys = Object.keys(first);
    if (firstKeys.length !== Object.keys(second).length) {
        return false;
    }
    for (const key of firstKeys) {
        if (!Object.hasOwn(second, key)) {
            return false;
        }
        if (
            !valuesEqual(
                readOwnProperty(first, key),
                readOwnProperty(second, key),
                seen,
            )
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Walks `value` looking for a cycle.
 *
 * @param value - The current value.
 * @param ancestors - Objects on the path from the root.
 * @returns `true` when `value` points at an ancestor.
 */
function cycleNode(value: unknown, ancestors: Set<object>): boolean {
    if (!isObjectLikeValue(value)) {
        return false;
    }
    if (ancestors.has(value)) {
        return true;
    }
    ancestors.add(value);
    let found = false;
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
            if (cycleNode(value[index], ancestors)) {
                found = true;
                break;
            }
        }
    } else if (isPlainObjectValue(value)) {
        for (const key of Object.keys(value)) {
            if (cycleNode(readOwnProperty(value, key), ancestors)) {
                found = true;
                break;
            }
        }
    }
    ancestors.delete(value);
    return found;
}
