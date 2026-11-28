import type {
    ArrayMerge,
    PrototypeKeys,
} from "../types/object-config.types.js";

/**
 * Arguments for `defaultsDeep`.
 */
export interface DefaultsDeepParams {
    /**
     * Source of truth.
     *
     * A value that is not object-like makes `defaultsDeep` return `undefined`.
     */
    object: unknown;

    /**
     * One object, or a list of objects, applied from left to right.
     *
     * A value that is neither object-like nor an array makes `defaultsDeep`
     * return `undefined`.
     */
    defaults: unknown;

    /**
     * How arrays combine when both sides are arrays.
     *
     * `"replace"` keeps the array already present on `object`.
     *
     * @defaultValue `"replace"`
     */
    arrayMerge?: ArrayMerge;

    /**
     * How `__proto__`, `prototype`, and `constructor` are written.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
