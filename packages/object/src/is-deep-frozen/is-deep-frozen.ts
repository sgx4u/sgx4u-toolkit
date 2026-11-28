import { forEachChild } from "../utils/child.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether `value` is frozen all the way down.
 *
 * Primitives, including `null`, return `true`. A frozen object that holds a
 * mutable nested object returns `false`. Map and set contents are included.
 * Cycles are visited once. `WeakMap` and `WeakSet` contents cannot be read, so
 * only the container is checked. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when every reachable object is frozen.
 * @example
 * isDeepFrozen(Object.freeze({ id: 1 }));
 */
export function isDeepFrozen(value: unknown): boolean {
    return isDeepFrozenNode(value, new Set());
}

/**
 * Checks one node and its children.
 *
 * @param value - The current value.
 * @param seen - Objects already accepted.
 * @returns `true` when this node and its children are frozen.
 */
function isDeepFrozenNode(value: unknown, seen: Set<object>): boolean {
    if (!isObjectLikeValue(value)) {
        return typeof value !== "function";
    }
    if (seen.has(value)) {
        return true;
    }
    if (!Object.isFrozen(value)) {
        return false;
    }
    seen.add(value);
    let frozen = true;
    forEachChild(value, (child) => {
        if (frozen && !isDeepFrozenNode(child, seen)) {
            frozen = false;
        }
    });
    return frozen;
}
