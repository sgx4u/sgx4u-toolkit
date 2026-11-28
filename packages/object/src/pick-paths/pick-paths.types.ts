import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `pickPaths`.
 */
export interface PickPathsParams {
    /**
     * The value to project.
     *
     * `null`, primitives, and functions return `undefined`. Arrays are
     * rebuilt as arrays.
     */
    object: unknown;

    /**
     * Paths to copy. Missing and illegal paths are left out.
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
