import type { PathSegment } from "../types/path.types.js";
import { parseJSONPointerText } from "../utils/path-text.utils.js";

/**
 * Parses an RFC 6901 JSON Pointer into path segments.
 *
 * `""` is the whole document and returns an empty array. Any other pointer
 * must start with `/`. `~1` is `/` and `~0` is `~`. An illegal escape returns
 * `undefined`. The `-` token stays a string so an array append can see it.
 * Canonical array indexes become numbers. A value that is not a string
 * returns `undefined`.
 *
 * @param pointer - Pointer text. Any other value returns `undefined`.
 * @returns The segments, or `undefined` when `pointer` is not a JSON Pointer.
 * @example
 * parseJSONPointer("/a~1b/0");
 */
export function parseJSONPointer(pointer: unknown): PathSegment[] | undefined {
    if (typeof pointer !== "string") {
        return undefined;
    }
    return parseJSONPointerText(pointer);
}
