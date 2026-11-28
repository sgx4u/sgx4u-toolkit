import {
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { readPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { ObjectPath } from "../types/path.types.js";
import type { GetPathsParams } from "./get-paths.types.js";

/**
 * Reads one value for each path, in order.
 *
 * A missing path, an illegal path, and a sparse hole use `defaultValue`, or
 * `undefined` when that argument is omitted. An empty path reads `object`.
 * A present value of `undefined` stays `undefined`. The input is not mutated.
 *
 * Dangerous keys are skipped. The whole call returns `undefined` when
 * `object` is not object-like or `paths` is not an array. One bad path does
 * not reject the other paths.
 *
 * @param params - The object, the paths, the default, and the path options.
 * @returns One result per path, or `undefined` when the input is not valid.
 * @throws {RangeError} When `pathStyle` is unknown or `pathDelimiter` is empty.
 * @example
 * getPaths({ object: { a: 1, b: 2 }, paths: ["a", "c"], defaultValue: 0 });
 */
export function getPaths(params: GetPathsParams): unknown[] | undefined {
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
    const results: unknown[] = [];
    for (const path of params.paths) {
        results.push(
            readOnePath(
                params.object,
                path,
                pathStyle,
                pathDelimiter,
                params.defaultValue,
            ),
        );
    }
    return results;
}

/**
 * Reads one path, using the default when it is missing.
 *
 * @param object - The root value.
 * @param path - The path to read.
 * @param pathStyle - How a string path is parsed.
 * @param pathDelimiter - The dot-path separator.
 * @param defaultValue - The value used when the path is missing.
 * @returns The value at the path, or `defaultValue`.
 */
function readOnePath(
    object: object,
    path: ObjectPath,
    pathStyle: "dot" | "json-pointer",
    pathDelimiter: string,
    defaultValue: unknown,
): unknown {
    const segments = resolvePathSegments(path, pathStyle, pathDelimiter);
    if (segments === undefined) {
        return defaultValue;
    }
    const lookup = readPathSegments(object, segments, false, "skip");
    if (!lookup.found) {
        return defaultValue;
    }
    return lookup.value;
}
