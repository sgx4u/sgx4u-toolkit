import type { PathSegment } from "../types/path.types.js";

/**
 * Arguments for `findValue`.
 */
export interface FindValueParams {
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
}
