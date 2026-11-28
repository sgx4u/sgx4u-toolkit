import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `getPaths`.
 */
export interface GetPathsParams {
    /**
     * The value to read.
     *
     * A non-object returns `undefined` for the whole call.
     */
    object: unknown;

    /**
     * Paths to read, in result order.
     *
     * A value that is not an array returns `undefined`.
     */
    paths: readonly ObjectPath[];

    /**
     * Used for a path that is missing, illegal, or a sparse hole.
     *
     * A present value of `undefined` does not select this default.
     */
    defaultValue?: unknown;

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
