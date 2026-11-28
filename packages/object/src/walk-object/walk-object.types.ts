import type { PathSegment } from "../types/path.types.js";

/**
 * One call to a `walkObject` visitor.
 */
export interface WalkObjectVisit {
    /** The current value. */
    value: unknown;
    /**
     * The key or index that selected this value.
     *
     * Omitted at the root.
     */
    key?: PropertyKey;
    /**
     * The path from the root.
     *
     * Empty at the root. Array indexes are numbers. Symbol keys and other
     * non-path keys are omitted from the path; `key` still carries them.
     */
    path: readonly PathSegment[];
    /**
     * The parent container.
     *
     * Omitted at the root.
     */
    parent?: unknown;
    /**
     * Skips the children of this value.
     *
     * Takes effect only when called before the visitor returns. Siblings are
     * still visited.
     */
    skip: () => void;
}

/**
 * A function called for each visited value.
 */
export type WalkObjectVisitor = (visit: WalkObjectVisit) => void;

/**
 * Arguments for `walkObject`.
 */
export interface WalkObjectParams {
    /** The value to walk. A primitive is visited once. */
    object: unknown;
    /** Called for each visited value. */
    visitor: WalkObjectVisitor;
    /**
     * Visit only values that have no children this walk would enter.
     *
     * An array is a leaf when `includeArrays` is false. `maxDepth` does not
     * turn a value with children into a leaf.
     *
     * @defaultValue `false`
     */
    leafOnly?: boolean;
    /**
     * Walk array elements.
     *
     * When false, the array itself can still be visited.
     *
     * @defaultValue `true`
     */
    includeArrays?: boolean;
    /**
     * The deepest level to visit. The root is level 0.
     *
     * `0` visits only the root. A negative number visits nothing.
     *
     * @defaultValue `Infinity`
     */
    maxDepth?: number;
}
