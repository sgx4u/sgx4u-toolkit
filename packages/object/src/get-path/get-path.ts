import {
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import { readPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import type { ObjectPath } from "../types/path.types.js";
import type { GetPathParams, GetPathResult } from "./get-path.types.js";

/**
 * Reads the value at `path`.
 *
 * An empty path returns `object`. A missing path, a sparse array hole, and
 * an illegal path return `defaultValue`, or `undefined` when that argument
 * is omitted. A present value of `undefined` is returned as `undefined` and
 * does not select the default. The input is not mutated.
 *
 * Dangerous keys are skipped unless `prototypeKeys` is `"keep"`. `"throw"`
 * does not raise while reading; it is treated as `"skip"`. An unknown
 * `pathStyle` or `prototypeKeys`, or an empty `pathDelimiter`, raises
 * `RangeError`.
 *
 * @param params - The value, path, default, and path options.
 * @returns The value at the path, or the default when the path is missing.
 * @throws {RangeError} When `pathStyle` or `prototypeKeys` is unknown, or when `pathDelimiter` is empty.
 * @example
 * getPath({ object: { id: 1 }, path: "id", defaultValue: 0 });
 */
export function getPath<
    ObjectType,
    const Path extends ObjectPath,
    const DefaultValue = undefined,
>(
    params: GetPathParams<ObjectType, Path, DefaultValue>,
): GetPathResult<ObjectType, Path, DefaultValue> {
    const pathStyle = readChoice(
        params.pathStyle,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    const prototypeKeys = readChoice(
        params.prototypeKeys,
        "prototypeKeys",
        prototypeKeyValues,
        "skip",
    );
    const pathDelimiter = readPathDelimiter(
        params.pathDelimiter,
        defaultPathDelimiter,
    );
    const segments = resolvePathSegments(params.path, pathStyle, pathDelimiter);
    if (segments === undefined) {
        return params.defaultValue as GetPathResult<
            ObjectType,
            Path,
            DefaultValue
        >;
    }
    const lookup = readPathSegments(
        params.object,
        segments,
        false,
        prototypeKeys,
    );
    if (!lookup.found) {
        return params.defaultValue as GetPathResult<
            ObjectType,
            Path,
            DefaultValue
        >;
    }
    return lookup.value as GetPathResult<ObjectType, Path, DefaultValue>;
}
