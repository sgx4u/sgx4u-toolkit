import type { PathSegment, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `findPath`.
 */
export interface FindPathParams {
    /** The value to search. */
    object: unknown;
    /**
     * Returns true when this node is the match.
     *
     * Called as `predicate(value, path, object)`. `path` is the segment list
     * from the root, and `object` is the value originally passed in.
     */
    predicate: (
        value: unknown,
        path: readonly PathSegment[],
        object: unknown,
    ) => boolean;
    /**
     * How the returned path is formatted.
     *
     * @defaultValue `"dot"`
     */
    pathStyle?: PathStyle;
    /**
     * Separator used when `pathStyle` is `"dot"`.
     *
     * @defaultValue `"."`
     */
    pathDelimiter?: string;
}
