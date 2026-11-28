import type { CircularPolicy } from "../types/object-config.types.js";

/**
 * How `flattenObject` treats an array.
 *
 * `"index"` walks elements and uses the index as a path segment.
 * `"keep"` stores the array as one value.
 */
export type FlattenArrays = "index" | "keep";

/**
 * Arguments for `flattenObject`.
 */
export interface FlattenObjectParams {
    /**
     * The plain object or array to flatten.
     *
     * `null` and primitives return `undefined`.
     */
    object: unknown;

    /**
     * The separator written between path segments.
     *
     * @defaultValue `"."`
     */
    delimiter?: string;

    /**
     * How many edges may be walked.
     *
     * When the next edge would pass this depth, the current value is stored
     * at the current prefix. `0` stores the root at `prefix`, or at `""` when
     * `prefix` is empty. An empty plain object or array at the root still
     * returns `{}` because it has no edges.
     *
     * @defaultValue `Infinity`
     */
    maxDepth?: number;

    /**
     * How arrays are flattened.
     *
     * @defaultValue `"index"`
     */
    arrays?: FlattenArrays;

    /**
     * What to do when a nested value points at an ancestor.
     *
     * `"skip"` omits that edge. `"throw"` raises `RangeError`. `"preserve"`
     * and `"replace"` also omit the edge: a flat record cannot point back at
     * an ancestor. A value stored whole because of `maxDepth` or
     * `arrays: "keep"` keeps its original reference.
     *
     * @defaultValue `"skip"`
     */
    circular?: CircularPolicy;

    /**
     * Text placed before every key. A non-empty prefix is joined with `delimiter`.
     *
     * @defaultValue `""`
     */
    prefix?: string;
}
