import type {
    ArrayMerge,
    CircularPolicy,
    PrototypeKeys,
} from "../types/object-config.types.js";
import type { MergeVisit } from "../utils/merge.utils.js";

export type { MergeVisit } from "../utils/merge.utils.js";

/**
 * Arguments for `mergeDeep`.
 */
export interface MergeDeepParams {
    /**
     * Values merged from left to right.
     *
     * A non-array makes `mergeDeep` return `undefined`.
     */
    objects: readonly unknown[];

    /**
     * How two arrays combine.
     *
     * @defaultValue `"replace"`
     */
    arrayMerge?: ArrayMerge;

    /**
     * Replaces the default rule when it returns anything other than
     * `undefined`. `undefined` keeps the default merge for that key.
     */
    customizer?: (details: MergeVisit) => unknown;

    /**
     * How `__proto__`, `prototype`, and `constructor` are written.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;

    /**
     * How a cycle in a source is handled.
     *
     * @defaultValue `"preserve"`
     */
    circular?: CircularPolicy;
}
