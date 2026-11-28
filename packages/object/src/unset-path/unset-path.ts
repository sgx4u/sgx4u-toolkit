import {
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { unsetPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { UnsetPathParams } from "./unset-path.types.js";

/**
 * Returns a copy of `object` with `path` removed.
 *
 * A missing path returns the same object. An empty path does not remove the
 * root and returns the same object. The input is not mutated. Empty parent
 * objects are left in place; use `omitPaths` when those parents should
 * disappear.
 *
 * When the parent is an array and the last segment is an index, that index
 * is spliced out and later items shift left. A hole is spliced the same way.
 * An index past the end leaves the array unchanged.
 *
 * An illegal path returns `undefined`. `null`, primitives, and functions
 * return `undefined`. Dangerous keys follow `prototypeKeys`. `"throw"` raises
 * `RangeError`. `"skip"` leaves the dangerous key in place.
 *
 * @param params - The object, path, and path options.
 * @returns The edited object, the same object when the path is already absent, or `undefined` when the input cannot be edited.
 * @throws {RangeError} When `pathStyle` or `prototypeKeys` is unknown, `pathDelimiter` is empty, or a dangerous key is rejected.
 * @example
 * unsetPath({ object: { a: { b: 1, c: 2 } }, path: "a.b" });
 */
export function unsetPath(params: UnsetPathParams): unknown {
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
    return unsetPathSegments(params.object, segments, prototypeKeys).result;
}
