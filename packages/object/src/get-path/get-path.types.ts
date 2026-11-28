import type { PrototypeKeys } from "../types/object-config.types.js";
import type { PathValue } from "../types/deep.types.js";
import type {
    ObjectPath,
    PathSegment,
    PathStyle,
} from "../types/path.types.js";

/**
 * Arguments for `getPath`.
 *
 * `ObjectType` is the value being read. `Path` is the path literal when the
 * caller passes one. `DefaultValue` is the type of `defaultValue` when it is
 * passed, and `undefined` when it is omitted.
 */
export interface GetPathParams<
    ObjectType = unknown,
    Path extends ObjectPath = ObjectPath,
    DefaultValue = undefined,
> {
    /** The value to read. An empty path returns this value. */
    object: ObjectType;

    /** A dot path, a JSON Pointer, a number, or an array of segments. */
    path: Path;

    /**
     * Returned when the path is missing or illegal.
     *
     * A present value of `undefined` does not select this default.
     */
    defaultValue?: DefaultValue;

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
     * How dangerous keys are read. `"throw"` is read as `"skip"` and does
     * not raise. An unknown value raises `RangeError`.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}

/**
 * The value at `Path`, or `DefaultValue` when the path is missing.
 *
 * A number path is `unknown` united with the default. `PathValue` resolves a
 * literal string such as `"a.b"` and a segment array. A bracket string such
 * as `"a[0].b"` stays wide because `PathValue` matches the dot first.
 */
export type GetPathResult<
    ObjectType,
    Path extends ObjectPath,
    DefaultValue,
> = Path extends readonly PathSegment[]
    ? PathValue<ObjectType, Path> | DefaultValue
    : Path extends string
      ? PathValue<ObjectType, Path> | DefaultValue
      : unknown | DefaultValue;
