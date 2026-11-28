import type { PrototypeKeys } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `hasPath`.
 */
export interface HasPathParams {
    /** The value to inspect. Any value is accepted. */
    object: unknown;

    /** The path to test. An illegal path returns `false`. */
    path: ObjectPath;

    /**
     * Count inherited properties for ordinary keys.
     *
     * A value that is present and is not a boolean returns `false`.
     *
     * @defaultValue `false`
     */
    inherited?: boolean;

    /**
     * How a string `path` is parsed.
     *
     * An unknown value returns `false`.
     *
     * @defaultValue `"dot"`
     */
    pathStyle?: PathStyle;

    /**
     * Separator used by a dot path.
     *
     * An empty string returns `false`.
     *
     * @defaultValue `"."`
     */
    pathDelimiter?: string;

    /**
     * How dangerous keys are read. `"throw"` is read as `"skip"`.
     *
     * An unknown value returns `false`.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
