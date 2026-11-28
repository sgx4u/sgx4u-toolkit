import type { PathStyle } from "../types/path.types.js";

/**
 * Arguments for the options form of `listCircularPaths`.
 */
export interface ListCircularPathsParams {
    /** The value to inspect. Primitives yield an empty array. */
    value: unknown;
    /**
     * How cycle paths are formatted.
     *
     * An unknown style is read as `"dot"`. The function does not throw.
     *
     * @defaultValue `"dot"`
     */
    pathStyle?: PathStyle;
    /**
     * Separator used when the style is `"dot"`.
     *
     * A value that is not a non-empty string is read as `"."`.
     *
     * @defaultValue `"."`
     */
    pathDelimiter?: string;
}
