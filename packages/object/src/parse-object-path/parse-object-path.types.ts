import type { PathStyle } from "../types/path.types.js";

/**
 * Arguments for the options form of `parseObjectPath`.
 */
export interface ParseObjectPathParams {
    /** Path text. A non-string returns `undefined`. */
    path: string;

    /**
     * How `path` is parsed.
     *
     * An unknown value raises `RangeError`.
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
