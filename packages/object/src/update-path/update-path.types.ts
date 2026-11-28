import type { PrototypeKeys } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `updatePath`.
 */
export interface UpdatePathParams {
    /**
     * The object to copy.
     *
     * `null`, primitives, and functions return `undefined`. The updater is
     * not called for those values.
     */
    object: unknown;

    /** The path to read and then write. An illegal path returns `undefined`. */
    path: ObjectPath;

    /**
     * Receives the current value, or `undefined` when the path is missing,
     * and returns the next value.
     */
    updater: (current: unknown) => unknown;

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
     * How dangerous keys are written. The read treats `"throw"` as `"skip"`.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
