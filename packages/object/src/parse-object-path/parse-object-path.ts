import {
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import {
    parseDotPathText,
    resolvePathSegments,
} from "../utils/path-text.utils.js";
import type { PathSegment } from "../types/path.types.js";
import type { ParseObjectPathParams } from "./parse-object-path.types.js";

const parseObjectPathFields: readonly string[] = [
    "path",
    "pathStyle",
    "pathDelimiter",
];

/**
 * Parses path text into segments.
 *
 * A string uses dot style and `"."`. An options object is recognized when
 * it is a plain object, owns `path`, and owns no other keys. An illegal
 * string returns `undefined` and does not throw. An unknown `pathStyle` or
 * an empty `pathDelimiter` on the options form raises `RangeError`.
 *
 * An empty string is the empty path and returns an empty array. Canonical
 * indexes become numbers. The input string is not modified.
 *
 * @param path - Dot-style path text.
 * @returns The segments, or `undefined` when the text is illegal.
 * @example
 * parseObjectPath("a.b.0.c");
 */
export function parseObjectPath(path: string): PathSegment[] | undefined;
/**
 * @param params - The path text and parse options.
 * @throws {RangeError} When `pathStyle` is unknown or `pathDelimiter` is empty.
 */
export function parseObjectPath(
    params: ParseObjectPathParams,
): PathSegment[] | undefined;
/**
 * @param pathOrParams - A path string or the options object.
 */
export function parseObjectPath(
    pathOrParams: unknown,
): PathSegment[] | undefined {
    if (typeof pathOrParams === "string") {
        return parseDotPathText(pathOrParams, defaultPathDelimiter);
    }
    if (!isParameterRecord(pathOrParams, "path", parseObjectPathFields)) {
        return undefined;
    }
    const pathStyle = readChoice(
        pathOrParams.pathStyle,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    const pathDelimiter = readPathDelimiter(
        pathOrParams.pathDelimiter,
        defaultPathDelimiter,
    );
    if (typeof pathOrParams.path !== "string") {
        return undefined;
    }
    return resolvePathSegments(pathOrParams.path, pathStyle, pathDelimiter);
}
