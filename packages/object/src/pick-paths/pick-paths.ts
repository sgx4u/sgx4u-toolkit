import {
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import { createDictionary } from "../utils/dangerous-key.utils.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { readPathSegments, setPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { PickPathsParams } from "./pick-paths.types.js";

/**
 * Rebuilds an object that contains only the given paths.
 *
 * Each path is read with `readPathSegments` and written with
 * `setPathSegments`, from left to right. A missing path, an illegal path,
 * and an empty path are left out. A later path overwrites an earlier one
 * when they select the same location. Leaf values keep their references.
 * The input is not mutated.
 *
 * The result is a new plain object, or a new array when `object` is an
 * array. Dangerous keys are skipped, so a path such as `__proto__.polluted`
 * is not copied and does not change `Object.prototype`. `null`, primitives,
 * and functions return `undefined`.
 *
 * @param params - The object, the paths, and the path options.
 * @returns The projection, or `undefined` when `object` is not object-like or `paths` is not an array.
 * @throws {RangeError} When `pathStyle` is unknown or `pathDelimiter` is empty.
 * @example
 * pickPaths({ object: { a: { b: 1, c: 2 }, d: 3 }, paths: ["a.b", "d"] });
 */
export function pickPaths(params: PickPathsParams): unknown {
    if (!isObjectLikeValue(params.object) || !Array.isArray(params.paths)) {
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
    let result: unknown = Array.isArray(params.object)
        ? []
        : createDictionary(params.object);
    for (const path of params.paths) {
        const segments = resolvePathSegments(path, pathStyle, pathDelimiter);
        if (segments === undefined || segments.length === 0) {
            continue;
        }
        const lookup = readPathSegments(params.object, segments, false, "skip");
        if (!lookup.found) {
            continue;
        }
        result = setPathSegments(result, segments, lookup.value, "skip").result;
    }
    return result;
}
