import type { PrototypeKeys } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `setPath`.
 */
export interface SetPathParams {
    /**
     * The object to copy.
     *
     * `null`, primitives, and functions return `undefined`. Arrays are
     * objects and are copied.
     */
    object: unknown;

    /** Where to store `value`. An illegal path returns `undefined`. */
    path: ObjectPath;

    /** The value to store. It is not cloned. */
    value: unknown;

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
     * How dangerous keys are written.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
