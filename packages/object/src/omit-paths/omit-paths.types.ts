import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `omitPaths`.
 */
export interface OmitPathsParams {
    /**
     * The value to copy.
     *
     * `null`, primitives, and functions return `undefined`.
     */
    object: unknown;

    /**
     * Paths to remove. Missing and illegal paths are ignored.
     *
     * A value that is not an array returns `undefined`.
     */
    paths: readonly ObjectPath[];

    /**
     * How a string path is parsed.
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
