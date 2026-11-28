import {
    lockObjectGraph,
    resolveLockArgument,
} from "../freeze-deep/freeze-deep.js";

/**
 * Seals `value` and every nested object.
 *
 * Pass a value, or `{ value, circular }` when `circular` is an own key.
 * `{ value: something }` alone is data. Map and set contents are sealed.
 * Cycles are visited once. The same reference is returned. Primitives and
 * functions are returned as-is. Existing properties stay writable. The only
 * mutation is the seal itself.
 *
 * @param value - A value, or the options object.
 * @returns The same reference.
 * @throws {RangeError} When `circular` is unknown, or when `circular` is `"throw"` and a cycle is found.
 * @example
 * sealDeep({ id: 1 });
 */
export function sealDeep(value: unknown): unknown {
    const resolved = resolveLockArgument(value);
    lockObjectGraph(resolved.target, resolved.circular, Object.seal);
    return resolved.target;
}
