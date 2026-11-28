import type { PrototypeKeys } from "../types/object-config.types.js";

/**
 * How `unflattenObject` turns integer path segments into arrays.
 *
 * `"auto"` converts a node only when its keys are exactly `"0"` through
 * `"n-1"` with no holes. `"always"` uses every canonical integer as an index
 * and leaves holes. `"never"` keeps every node as an object.
 */
export type UnflattenArrays = "auto" | "never" | "always";

/**
 * Arguments for `unflattenObject`.
 */
export interface UnflattenObjectParams {
    /**
     * A flat record whose keys are paths.
     *
     * `null`, primitives, and arrays return `undefined`.
     */
    object: unknown;

    /**
     * The separator between path segments.
     *
     * @defaultValue `"."`
     */
    delimiter?: string;

    /**
     * How integer segments become arrays.
     *
     * @defaultValue `"auto"`
     */
    arrays?: UnflattenArrays;

    /**
     * What to do with `__proto__`, `prototype`, and `constructor` segments.
     *
     * `"skip"` drops the whole flat key. `"throw"` raises `RangeError`.
     * `"keep"` writes an own data property and does not walk `Object.prototype`.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
