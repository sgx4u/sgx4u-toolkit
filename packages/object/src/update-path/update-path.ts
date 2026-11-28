import {
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import {
    assertFunction,
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { readPathSegments, setPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { UpdatePathParams } from "./update-path.types.js";

/**
 * Returns a copy of `object` with the value at `path` replaced.
 *
 * The current value is read and passed to `updater`. A missing path passes
 * `undefined`. The returned value is written with the same rules as
 * `setPath`. When that write does not change the object, the same object is
 * returned. The input is not mutated.
 *
 * `updater` is not called when `object` is not object-like or the path text
 * is illegal; those calls return `undefined`. An updater that is not a
 * function raises `TypeError` before the options are checked. Dangerous
 * keys follow `prototypeKeys` on the write. The read treats `"throw"` as
 * `"skip"`, then the write raises if a dangerous key is rejected.
 *
 * @param params - The object, path, updater, and path options.
 * @returns The edited object, or `undefined` when the input cannot be edited.
 * @throws {TypeError} When `updater` is not a function.
 * @throws {RangeError} When `pathStyle` or `prototypeKeys` is unknown, `pathDelimiter` is empty, or a dangerous key is rejected.
 * @example
 * updatePath({ object: { count: 1 }, path: "count", updater: (value) => Number(value) + 1 });
 */
export function updatePath(params: UpdatePathParams): unknown {
    assertFunction(params.updater, "updater");
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
    const lookup = readPathSegments(
        params.object,
        segments,
        false,
        prototypeKeys,
    );
    const current = lookup.found ? lookup.value : undefined;
    return setPathSegments(
        params.object,
        segments,
        params.updater(current),
        prototypeKeys,
    ).result;
}
