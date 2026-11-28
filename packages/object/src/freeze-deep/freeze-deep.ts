import { circularValues } from "../constants/object-options.constants.js";
import type { CircularPolicy } from "../types/object-config.types.js";
import { forEachChild } from "../utils/child.utils.js";
import { readChoice } from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";

const lockFields = ["value", "circular"] as const;

/**
 * Freezes `value` and every nested object.
 *
 * Pass a value, or `{ value, circular }` when `circular` is an own key.
 * `{ value: something }` alone is data: the object that owns `value` is
 * frozen. Map and set contents are frozen. Cycles are visited once. The
 * same reference is returned. Primitives and functions are returned as-is.
 * The only mutation is the freeze itself.
 *
 * @param value - A value, or the options object.
 * @returns The same reference.
 * @throws {RangeError} When `circular` is unknown, or when `circular` is `"throw"` and a cycle is found.
 * @example
 * freezeDeep({ id: 1 });
 */
export function freezeDeep(value: unknown): unknown {
    const resolved = resolveLockArgument(value);
    lockObjectGraph(resolved.target, resolved.circular, Object.freeze);
    return resolved.target;
}

/**
 * Reads a lock argument as data, or as options when `circular` is present.
 *
 * Options require a plain object that owns `value`, owns `circular`, and
 * owns no other string key. `isParameterRecord` enforces that key set.
 *
 * @param input - A value, or `{ value, circular }`.
 * @returns The value to lock and the cycle policy.
 * @throws {RangeError} When the options form has an unknown `circular` value.
 */
export function resolveLockArgument(input: unknown): {
    circular: CircularPolicy;
    target: unknown;
} {
    if (
        isParameterRecord(input, "value", lockFields) &&
        Object.hasOwn(input, "circular")
    ) {
        return {
            circular: readChoice(
                input.circular,
                "circular",
                circularValues,
                "preserve",
            ),
            target: input.value,
        };
    }
    return { circular: "preserve", target: input };
}

/**
 * Applies `lock` to `value` and to every object `forEachChild` can see.
 *
 * A cycle is visited once. `"throw"` checks the graph first and leaves it
 * unchanged when a cycle is present. `"preserve"`, `"skip"`, and `"replace"`
 * lock the cycle node once.
 *
 * @param value - The root value.
 * @param circular - A known cycle policy.
 * @param lock - `Object.freeze`, `Object.seal`, or `Object.preventExtensions`.
 * @throws {RangeError} When `circular` is `"throw"` and a cycle is found.
 */
export function lockObjectGraph(
    value: unknown,
    circular: CircularPolicy,
    lock: (target: object) => object,
): void {
    if (circular === "throw") {
        assertAcyclic(value, new Set());
    }
    lockNode(value, new Set(), lock);
}

/**
 * Rejects a value that points at an ancestor.
 *
 * @param value - The current value.
 * @param ancestors - Objects on the path from the root.
 * @throws {RangeError} When `value` is already on the path.
 */
function assertAcyclic(value: unknown, ancestors: Set<object>): void {
    if (!isObjectLikeValue(value)) {
        return;
    }
    if (ancestors.has(value)) {
        throw new RangeError(
            "`circular` blocked a cycle. The value points at an ancestor.",
        );
    }
    ancestors.add(value);
    forEachChild(value, (child) => {
        assertAcyclic(child, ancestors);
    });
    ancestors.delete(value);
}

/**
 * Locks one node and its children.
 *
 * @param value - The current value.
 * @param seen - Objects already locked.
 * @param lock - The operation applied to each object.
 */
function lockNode(
    value: unknown,
    seen: Set<object>,
    lock: (target: object) => object,
): void {
    if (!isObjectLikeValue(value) || seen.has(value)) {
        return;
    }
    seen.add(value);
    lock(value);
    forEachChild(value, (child) => {
        lockNode(child, seen, lock);
    });
}
