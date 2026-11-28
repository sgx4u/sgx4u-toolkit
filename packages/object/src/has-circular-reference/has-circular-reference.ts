import { forEachChild } from "../utils/child.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";

/**
 * Reports whether a nested object points back at an ancestor.
 *
 * Arrays, plain objects, class instances, map entries, and set values are
 * walked. A shared reference that is not an ancestor returns `false`.
 * Primitives return `false`. The function does not throw.
 *
 * @param value - Any value.
 * @returns `true` when a cycle is found.
 * @example
 * const box: { self?: object } = {};
 * box.self = box;
 * hasCircularReference(box);
 */
export function hasCircularReference(value: unknown): boolean {
    return hasCycle(value, new Set());
}

/**
 * Walks `value` and reports an ancestor match.
 *
 * @param value - The current value.
 * @param ancestors - Objects on the path from the root.
 * @returns `true` when this node starts or contains a cycle.
 */
function hasCycle(value: unknown, ancestors: Set<object>): boolean {
    if (!isObjectLikeValue(value)) {
        return false;
    }
    if (ancestors.has(value)) {
        return true;
    }
    ancestors.add(value);
    let found = false;
    forEachChild(value, (child) => {
        if (!found && hasCycle(child, ancestors)) {
            found = true;
        }
    });
    ancestors.delete(value);
    return found;
}
