import type { PathSegment } from "../types/path.types.js";
import { formatJSONPointerText } from "../utils/path-text.utils.js";

/**
 * Formats path segments as an RFC 6901 JSON Pointer.
 *
 * `~` is escaped before `/`, so a slash produced by an escape is not escaped
 * again. An empty segment list is `""`, the whole document. A value that is
 * not an array returns `undefined`. A segment that is not a string or a
 * finite number returns `undefined`.
 *
 * @param segments - Path segments. Any other value returns `undefined`.
 * @returns The pointer, or `undefined` when `segments` cannot be formatted.
 * @example
 * formatJSONPointer(["a/b", 0]);
 */
export function formatJSONPointer(segments: unknown): string | undefined {
    if (!Array.isArray(segments)) {
        return undefined;
    }
    const parsed: PathSegment[] = [];
    for (const segment of segments) {
        if (typeof segment === "string") {
            parsed.push(segment);
            continue;
        }
        if (typeof segment === "number") {
            parsed.push(segment);
            continue;
        }
        return undefined;
    }
    return formatJSONPointerText(parsed);
}
