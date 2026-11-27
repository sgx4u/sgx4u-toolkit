import {
    lockObjectGraph,
    resolveLockArgument,
} from "../freeze-deep/freeze-deep.js";

/**
 * Prevents extensions on `value` and every nested object.
 *
 * Pass a value, or `{ value, circular }` when `circular` is an own key.
 * `{ value: something }` alone is data. Map and set contents are included.
 * Cycles are visited once. The same reference is returned. Primitives and
 * functions are returned as-is. Existing properties stay configurable. The
 * only mutation is `Object.preventExtensions`.
 *
 * @param value - A value, or the options object.
 * @returns The same reference.
 * @throws {RangeError} When `circular` is unknown, or when `circular` is `"throw"` and a cycle is found.
 * @example
 * preventExtensionsDeep({ id: 1 });
 */
export function preventExtensionsDeep(value: unknown): unknown {
    const resolved = resolveLockArgument(value);
    lockObjectGraph(
        resolved.target,
        resolved.circular,
        Object.preventExtensions,
    );
    return resolved.target;
}
