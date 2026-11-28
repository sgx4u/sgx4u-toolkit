import {
    defaultPathDelimiter,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import type { PathSegment, PathStyle } from "../types/path.types.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import {
    assertFunction,
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import {
    formatDotPathText,
    formatJSONPointerText,
} from "../utils/path-text.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { FindPathParams } from "./find-path.types.js";

/**
 * Returns the formatted path of the first depth-first match.
 *
 * The root is tested first. Plain objects and arrays are walked. Other
 * objects are tested and not entered. A cycle is not entered again. The
 * empty path is `""`. The input is not mutated.
 *
 * @param params - The value, the predicate, and the path format.
 * @returns The path text, or `undefined` when nothing matches.
 * @throws {TypeError} When `predicate` is not a function.
 * @throws {RangeError} When `pathStyle` or `pathDelimiter` is invalid.
 * @example
 * findPath({
 *     object: { user: { id: 1 } },
 *     predicate: (value) => value === 1,
 * });
 */
export function findPath(params: FindPathParams): string | undefined {
    assertFunction(params.predicate, "predicate");
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
    return searchPath(
        params.object,
        [],
        params.object,
        params.predicate,
        pathStyle,
        pathDelimiter,
        new Set(),
    );
}

/**
 * Tests one node, then its plain-object and array children.
 *
 * @param value - The current value.
 * @param path - Segments from the root.
 * @param root - The value passed to `findPath`.
 * @param predicate - The caller's predicate.
 * @param pathStyle - How a match is formatted.
 * @param pathDelimiter - The dot-path separator.
 * @param ancestors - Objects on the path from the root.
 * @returns The formatted path, or `undefined`.
 */
function searchPath(
    value: unknown,
    path: readonly PathSegment[],
    root: unknown,
    predicate: FindPathParams["predicate"],
    pathStyle: PathStyle,
    pathDelimiter: string,
    ancestors: Set<object>,
): string | undefined {
    if (isObjectLikeValue(value) && ancestors.has(value)) {
        return undefined;
    }
    if (predicate(value, path, root)) {
        return formatSearchPath(path, pathStyle, pathDelimiter);
    }
    if (!isObjectLikeValue(value)) {
        return undefined;
    }
    if (!Array.isArray(value) && !isPlainObjectValue(value)) {
        return undefined;
    }
    ancestors.add(value);
    const found = searchChildren(
        value,
        path,
        root,
        predicate,
        pathStyle,
        pathDelimiter,
        ancestors,
    );
    ancestors.delete(value);
    return found;
}

/**
 * Searches the children of a plain object or an array.
 *
 * @param value - The parent container.
 * @param path - The parent path.
 * @param root - The value passed to `findPath`.
 * @param predicate - The caller's predicate.
 * @param pathStyle - How a match is formatted.
 * @param pathDelimiter - The dot-path separator.
 * @param ancestors - Objects on the path from the root.
 * @returns The formatted path, or `undefined`.
 */
function searchChildren(
    value: object,
    path: readonly PathSegment[],
    root: unknown,
    predicate: FindPathParams["predicate"],
    pathStyle: PathStyle,
    pathDelimiter: string,
    ancestors: Set<object>,
): string | undefined {
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
            if (!Object.hasOwn(value, index)) {
                continue;
            }
            const found = searchPath(
                value[index],
                [...path, index],
                root,
                predicate,
                pathStyle,
                pathDelimiter,
                ancestors,
            );
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    }
    for (const key of Object.keys(value)) {
        const found = searchPath(
            readOwnProperty(value, key),
            [...path, key],
            root,
            predicate,
            pathStyle,
            pathDelimiter,
            ancestors,
        );
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}

/**
 * Formats a path that a predicate accepted.
 *
 * @param path - Segments from the root.
 * @param pathStyle - `"dot"` or `"json-pointer"`.
 * @param pathDelimiter - The dot-path separator.
 * @returns The path text, or `undefined` when it cannot be formatted.
 */
function formatSearchPath(
    path: readonly PathSegment[],
    pathStyle: PathStyle,
    pathDelimiter: string,
): string | undefined {
    if (pathStyle === "json-pointer") {
        return formatJSONPointerText(path);
    }
    return formatDotPathText(path, pathDelimiter);
}
