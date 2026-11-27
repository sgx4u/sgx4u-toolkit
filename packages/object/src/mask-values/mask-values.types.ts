import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `maskValues`.
 */
export interface MaskValuesParams {
    /**
     * The value to copy.
     *
     * A value that is not object-like returns `undefined`.
     */
    object: unknown;
    /** Paths to replace. A missing or illegal path is ignored. */
    paths: readonly ObjectPath[];
    /**
     * The value written at each found path.
     *
     * @defaultValue `"[Redacted]"`
     */
    replaceWith?: unknown;
    /**
     * How string paths are parsed.
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
