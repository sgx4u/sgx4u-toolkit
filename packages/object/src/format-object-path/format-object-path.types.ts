import type { PathSegment, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `formatObjectPath`.
 */
export interface FormatObjectPathParams {
    /**
     * Segments to format.
     *
     * A value that is not an array returns `undefined`. A segment that is
     * not a string or a finite number returns `undefined`.
     */
    segments: readonly PathSegment[];

    /**
     * How the segments are written.
     *
     * @defaultValue `"dot"`
     */
    pathStyle?: PathStyle;

    /**
     * Separator used by a dot path.
     *
     * @defaultValue `"."`
     */
    pathDelimiter?: string;
}
