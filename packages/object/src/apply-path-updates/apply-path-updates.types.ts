import type { PrototypeKeys } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * One write applied by `applyPathUpdates`.
 */
export interface PathUpdate {
    /** Where to store `value`. */
    path: ObjectPath;

    /** The value to store. It is not cloned. */
    value: unknown;
}

/**
 * Arguments for `applyPathUpdates`.
 */
export interface ApplyPathUpdatesParams {
    /**
     * The object to copy.
     *
     * `null`, primitives, and functions return `undefined`.
     */
    object: unknown;

    /**
     * Writes to apply from left to right.
     *
     * A plain object uses its own enumerable string keys as path text. An
     * array uses each entry's `path` and `value`. Any other value returns
     * `undefined`.
     */
    updates: Readonly<Record<string, unknown>> | readonly PathUpdate[];

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

    /**
     * How dangerous keys are written.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
