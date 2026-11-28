import {
    defaultMaskText,
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import type { PathSegment } from "../types/path.types.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { readPathSegments, setPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { MaskValuesParams } from "./mask-values.types.js";

/**
 * Returns a copy of `object` with the listed paths replaced.
 *
 * A path is written only when `readPathSegments` finds it. Missing paths are
 * ignored. Unchanged parts keep their references. The input is not mutated.
 * A value that is not object-like returns `undefined`.
 *
 * @param params - The object, the paths, and the replacement.
 * @returns The masked value, or `undefined` when `object` is not object-like.
 * @throws {RangeError} When `pathStyle` or `pathDelimiter` is invalid.
 * @example
 * maskValues({ object: { password: "secret" }, paths: ["password"] });
 */
export function maskValues(params: MaskValuesParams): unknown {
    if (!isObjectLikeValue(params.object)) {
        return undefined;
    }
    const pathStyle = readChoice(
        params.pathStyle,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    const pathDelimiter = readPathDelimiter(
        params.pathDelimiter,
        defaultPathDelimiter,
    );
    const replaceWith =
        params.replaceWith === undefined ? defaultMaskText : params.replaceWith;
    const paths = Array.isArray(params.paths) ? params.paths : [];
    let current: unknown = params.object;
    for (const path of paths) {
        const segments = resolvePathSegments(path, pathStyle, pathDelimiter);
        if (segments === undefined) {
            continue;
        }
        current = maskFoundPath(current, segments, replaceWith);
    }
    return current;
}

/**
 * Replaces `segments` when that path exists.
 *
 * @param current - The value so far.
 * @param segments - A path that already parsed.
 * @param replaceWith - The replacement value.
 * @returns The edited value, or `current` when the path is missing.
 */
function maskFoundPath(
    current: unknown,
    segments: readonly PathSegment[],
    replaceWith: unknown,
): unknown {
    const lookup = readPathSegments(current, segments, false, "skip");
    if (!lookup.found) {
        return current;
    }
    return setPathSegments(current, segments, replaceWith, "skip").result;
}
