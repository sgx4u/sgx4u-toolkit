import type {
    ObjectPath,
    PathSegment,
    PathStyle,
} from "../types/path.types.js";

/**
 * A canonical array index written as text.
 *
 * `"0"` and `"12"` qualify. `"01"`, `"-1"`, and `""` do not.
 *
 * @param text - Candidate index text.
 * @returns The index, or `undefined` when the text is not a canonical index.
 */
export function canonicalInteger(text: string): number | undefined {
    if (!/^(0|[1-9]\d*)$/.test(text)) {
        return undefined;
    }
    const value = Number(text);
    if (!Number.isSafeInteger(value)) {
        return undefined;
    }
    return value;
}

/**
 * The array index named by `segment`, when it is a canonical index.
 *
 * @param segment - A path segment.
 * @returns The index, or `undefined` when the segment does not address an array index.
 */
export function arrayIndexFromSegment(
    segment: PathSegment,
): number | undefined {
    if (typeof segment === "number") {
        if (Number.isSafeInteger(segment) && segment >= 0) {
            return segment;
        }
        return undefined;
    }
    return canonicalInteger(segment);
}

/**
 * Parses a dot path.
 *
 * A backslash escapes the delimiter, `\`, `[`, and `]`. Bracket text is one
 * segment. Canonical integers become numbers. An illegal escape or an empty
 * dotted segment returns `undefined`. An empty string is the empty path.
 *
 * @param path - Dot-style path text.
 * @param delimiter - The separator. It must be non-empty.
 * @returns The segments, or `undefined` when the text is illegal.
 */
export function parseDotPathText(
    path: string,
    delimiter: string,
): PathSegment[] | undefined {
    if (path.length === 0) {
        return [];
    }
    const segments: PathSegment[] = [];
    let buffer = "";
    for (let index = 0; index < path.length; index += 1) {
        const character = path[index];
        if (character === undefined) {
            break;
        }
        if (character === "\\") {
            const escaped = path[index + 1];
            if (escaped === undefined) {
                return undefined;
            }
            buffer += escaped;
            index += 1;
            continue;
        }
        if (character === "[") {
            if (buffer.length > 0) {
                segments.push(normalizeSegment(buffer));
                buffer = "";
            }
            const bracket = readBracket(path, index);
            if (bracket === undefined) {
                return undefined;
            }
            segments.push(bracket.segment);
            index = bracket.nextIndex;
            continue;
        }
        if (character === "]") {
            return undefined;
        }
        if (path.startsWith(delimiter, index)) {
            if (buffer.length === 0) {
                // `a[0].b` has an empty buffer after the bracket. A leading
                // delimiter, or a delimiter that does not follow `]`, is empty.
                if (segments.length === 0 || path[index - 1] !== "]") {
                    return undefined;
                }
            } else {
                segments.push(normalizeSegment(buffer));
                buffer = "";
            }
            index += delimiter.length - 1;
            continue;
        }
        buffer += character;
    }
    if (buffer.length === 0) {
        if (segments.length > 0 && path.endsWith("]")) {
            return segments;
        }
        return undefined;
    }
    segments.push(normalizeSegment(buffer));
    return segments;
}

/**
 * Parses an RFC 6901 JSON Pointer.
 *
 * `""` is the whole document. Any other pointer starts with `/`. `~1` is `/`
 * and `~0` is `~`. An illegal escape returns `undefined`. The `-` token stays
 * a string. Canonical integers become numbers.
 *
 * @param pointer - Pointer text.
 * @returns The segments, or `undefined` when the text is not a pointer.
 */
export function parseJSONPointerText(
    pointer: string,
): PathSegment[] | undefined {
    if (pointer.length === 0) {
        return [];
    }
    if (!pointer.startsWith("/")) {
        return undefined;
    }
    const tokens = pointer.split("/");
    const segments: PathSegment[] = [];
    for (let index = 1; index < tokens.length; index += 1) {
        const token = tokens[index];
        if (token === undefined) {
            return undefined;
        }
        const decoded = decodePointerToken(token);
        if (decoded === undefined) {
            return undefined;
        }
        if (decoded === "-") {
            segments.push(decoded);
            continue;
        }
        segments.push(normalizeSegment(decoded));
    }
    return segments;
}

/**
 * Formats segments as a dot path.
 *
 * Numbers are written as `[n]`. String segments escape the delimiter and brackets.
 *
 * @param segments - Path segments.
 * @param delimiter - The separator.
 * @returns The path text, or `undefined` when a segment is not a string or finite number.
 */
export function formatDotPathText(
    segments: readonly PathSegment[],
    delimiter: string,
): string | undefined {
    let result = "";
    for (const segment of segments) {
        if (typeof segment === "number") {
            if (!Number.isFinite(segment)) {
                return undefined;
            }
            result += `[${segment}]`;
            continue;
        }
        if (typeof segment !== "string") {
            return undefined;
        }
        const escaped = escapeDotSegment(segment, delimiter);
        if (result.length > 0) {
            result += delimiter;
        }
        result += escaped;
    }
    return result;
}

/**
 * Formats segments as an RFC 6901 JSON Pointer.
 *
 * @param segments - Path segments.
 * @returns The pointer, or `undefined` when a segment is not a string or finite number.
 */
export function formatJSONPointerText(
    segments: readonly PathSegment[],
): string | undefined {
    let result = "";
    for (const segment of segments) {
        if (typeof segment === "number") {
            if (!Number.isFinite(segment)) {
                return undefined;
            }
        } else if (typeof segment !== "string") {
            return undefined;
        }
        result += `/${escapePointerToken(String(segment))}`;
    }
    return result;
}

/**
 * Turns `path` into segments.
 *
 * Array paths are copied and not parsed. A number is one segment.
 *
 * @param path - A path value.
 * @param pathStyle - How a string path is read.
 * @param pathDelimiter - The dot-style separator.
 * @returns The segments, or `undefined` when a string path is illegal.
 */
export function resolvePathSegments(
    path: ObjectPath,
    pathStyle: PathStyle,
    pathDelimiter: string,
): PathSegment[] | undefined {
    if (typeof path === "number") {
        return [path];
    }
    if (typeof path === "string") {
        if (pathStyle === "json-pointer") {
            return parseJSONPointerText(path);
        }
        return parseDotPathText(path, pathDelimiter);
    }
    if (Array.isArray(path)) {
        const segments: PathSegment[] = [];
        for (const segment of path) {
            if (typeof segment === "string") {
                segments.push(segment);
                continue;
            }
            if (typeof segment === "number" && Number.isFinite(segment)) {
                segments.push(segment);
                continue;
            }
            return undefined;
        }
        return segments;
    }
    return undefined;
}

/**
 * Canonicalizes an integer segment and leaves every other string as text.
 *
 * @param text - One unescaped segment.
 * @returns A number when `text` is a canonical index, otherwise `text`.
 */
function normalizeSegment(text: string): PathSegment {
    return canonicalInteger(text) ?? text;
}

/**
 * Reads `[...]` starting at `openingIndex`.
 *
 * @param path - The full path text.
 * @param openingIndex - The index of `[`.
 * @returns The segment and the index of `]`, or `undefined` when the bracket is unfinished.
 */
function readBracket(
    path: string,
    openingIndex: number,
): { segment: PathSegment; nextIndex: number } | undefined {
    let buffer = "";
    for (let index = openingIndex + 1; index < path.length; index += 1) {
        const character = path[index];
        if (character === undefined) {
            return undefined;
        }
        if (character === "\\") {
            const escaped = path[index + 1];
            if (escaped === undefined) {
                return undefined;
            }
            buffer += escaped;
            index += 1;
            continue;
        }
        if (character === "]") {
            return { segment: normalizeSegment(buffer), nextIndex: index };
        }
        buffer += character;
    }
    return undefined;
}

/**
 * Decodes one JSON Pointer token.
 *
 * @param token - Text between slashes, still escaped.
 * @returns The decoded segment, or `undefined` when a `~` is not `~0` or `~1`.
 */
function decodePointerToken(token: string): string | undefined {
    let result = "";
    for (let index = 0; index < token.length; index += 1) {
        const character = token[index];
        if (character === undefined) {
            break;
        }
        if (character !== "~") {
            result += character;
            continue;
        }
        const escaped = token[index + 1];
        if (escaped === "0") {
            result += "~";
            index += 1;
            continue;
        }
        if (escaped === "1") {
            result += "/";
            index += 1;
            continue;
        }
        return undefined;
    }
    return result;
}

/**
 * Escapes `~` and `/` in a pointer token.
 *
 * `~` is escaped first so an escaped slash is not escaped again.
 *
 * @param token - Raw segment text.
 * @returns Pointer token text.
 */
function escapePointerToken(token: string): string {
    return token.replaceAll("~", "~0").replaceAll("/", "~1");
}

/**
 * Escapes a dot-path segment.
 *
 * @param segment - Raw key text.
 * @param delimiter - The separator to escape.
 * @returns Escaped key text.
 */
function escapeDotSegment(segment: string, delimiter: string): string {
    let result = "";
    for (let index = 0; index < segment.length;) {
        if (segment.startsWith(delimiter, index)) {
            result += `\\${delimiter}`;
            index += delimiter.length;
            continue;
        }
        const character = segment[index];
        if (character === undefined) {
            break;
        }
        if (character === "\\" || character === "[" || character === "]") {
            result += `\\${character}`;
            index += 1;
            continue;
        }
        result += character;
        index += 1;
    }
    return result;
}
