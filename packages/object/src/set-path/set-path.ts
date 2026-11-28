import {
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { setPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { SetPathParams } from "./set-path.types.js";

/**
 * Returns a copy of `object` with `value` stored at `path`.
 *
 * Ancestors on the path are copied. Unchanged subtrees keep their
 * references. When the stored value is already the value at that path, the
 * same object is returned. The input is not mutated. A missing parent is
 * created: a following index creates an array, and any other segment creates
 * a plain object.
 *
 * An empty path replaces the root, and that replacement is returned even
 * when it is not an object. An illegal path returns `undefined`. `null`,
 * primitives, and functions return `undefined`. Arrays are copied.
 *
 * Dangerous keys follow `prototypeKeys`. `"skip"` drops the key and can
 * also drop a dangerous own key while copying an ancestor. `"keep"` writes
 * an own data property and does not change `Object.prototype`. `"throw"`
 * raises `RangeError` and writes nothing.
 *
 * @param params - The object, path, value, and path options.
 * @returns The edited object, the same object when nothing changed, or `undefined` when the input cannot be edited.
 * @throws {RangeError} When `pathStyle` or `prototypeKeys` is unknown, `pathDelimiter` is empty, or a dangerous key is rejected.
 * @example
 * setPath({ object: { a: { b: 1 } }, path: "a.c", value: 2 });
 */
export function setPath(params: SetPathParams): unknown {
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
    if (!isObjectLikeValue(params.object)) {
        return undefined;
    }
    const segments = resolvePathSegments(params.path, pathStyle, pathDelimiter);
    if (segments === undefined) {
        return undefined;
    }
    return setPathSegments(params.object, segments, params.value, prototypeKeys)
        .result;
}
