import type { PrototypeKeys } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `unsetPath`.
 */
export interface UnsetPathParams {
    /**
     * The object to copy.
     *
     * `null`, primitives, and functions return `undefined`.
     */
    object: unknown;

    /**
     * The path to remove.
     *
     * An illegal path returns `undefined`. A missing path returns `object`.
     */
    path: ObjectPath;

    /**
     * How a string `path` is parsed.
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

    /**
     * How dangerous keys are treated.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
