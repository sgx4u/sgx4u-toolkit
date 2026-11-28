import {
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import {
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import {
    formatDotPathText,
    formatJSONPointerText,
} from "../utils/path-text.utils.js";
import type { FormatObjectPathParams } from "./format-object-path.types.js";

/**
 * Formats segments as a dot path or a JSON Pointer.
 *
 * This is the inverse of `parseObjectPath` for segments that function
 * produces. A number is written as `[n]` in a dot path and as a decimal
 * token in a pointer. String segments escape the delimiter. The segment
 * array is not mutated.
 *
 * A non-array `segments` returns `undefined`. A segment that is not a
 * string or a finite number returns `undefined`.
 *
 * @param params - The segments and format options.
 * @returns The path text, or `undefined` when the segments cannot be formatted.
 * @throws {RangeError} When `pathStyle` is unknown or `pathDelimiter` is empty.
 * @example
 * formatObjectPath({ segments: ["a", "b", 0] });
 */
export function formatObjectPath(
    params: FormatObjectPathParams,
): string | undefined {
    if (!Array.isArray(params.segments)) {
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
    if (pathStyle === "json-pointer") {
        return formatJSONPointerText(params.segments);
    }
    return formatDotPathText(params.segments, pathDelimiter);
}
