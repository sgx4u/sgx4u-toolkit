import {
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
} from "../constants/object-options.constants.js";
import { readChoiceOrSkip } from "../utils/describe-received.utils.js";
import { readPathSegments } from "../utils/path-edit.utils.js";
import { resolvePathSegments } from "../utils/path-text.utils.js";
import type { HasPathParams } from "./has-path.types.js";

/**
 * Reports whether `path` can be read from `object`.
 *
 * Own properties are required unless `inherited` is true. A sparse array
 * hole is missing. An empty path is present, because it addresses the value
 * itself, including `null` and primitives. An illegal path is missing.
 * Dangerous keys are missing unless `prototypeKeys` is `"keep"`.
 *
 * The function never throws. An unknown `pathStyle`, `prototypeKeys`, or
 * `inherited`, or an empty `pathDelimiter`, returns `false`. `"throw"` does
 * not raise; it is read as `"skip"`. The input is not mutated.
 *
 * @param params - The value, path, and path options.
 * @returns `true` when the path is present.
 * @example
 * hasPath({ object: { id: 1 }, path: "id" });
 */
export function hasPath(params: HasPathParams): boolean {
    const pathStyle = readChoiceOrSkip(
        params.pathStyle,
        pathStyleValues,
        "dot",
    );
    const prototypeKeys = readChoiceOrSkip(
        params.prototypeKeys,
        prototypeKeyValues,
        "skip",
    );
    const pathDelimiter = readDelimiterOrSkip(params.pathDelimiter);
    if (
        pathStyle === undefined ||
        prototypeKeys === undefined ||
        pathDelimiter === undefined ||
        !isInheritedFlag(params.inherited)
    ) {
        return false;
    }
    const segments = resolvePathSegments(params.path, pathStyle, pathDelimiter);
    if (segments === undefined) {
        return false;
    }
    return readPathSegments(
        params.object,
        segments,
        params.inherited === true,
        prototypeKeys,
    ).found;
}

/**
 * Reads a delimiter without throwing.
 *
 * @param value - The delimiter the caller passed.
 * @returns A non-empty string, or `undefined` when the value is not allowed.
 */
function readDelimiterOrSkip(value: unknown): string | undefined {
    if (value === undefined) {
        return defaultPathDelimiter;
    }
    if (typeof value === "string" && value.length > 0) {
        return value;
    }
    return undefined;
}

/**
 * Whether `value` is an allowed `inherited` flag.
 *
 * @param value - The flag the caller passed.
 * @returns `true` when the flag is omitted or is a boolean.
 */
function isInheritedFlag(value: unknown): boolean {
    return value === undefined || typeof value === "boolean";
}
