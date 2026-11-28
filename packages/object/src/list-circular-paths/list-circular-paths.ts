import { defaultPathDelimiter } from "../constants/object-options.constants.js";
import type { PathSegment, PathStyle } from "../types/path.types.js";
import { forEachChild } from "../utils/child.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import {
    formatDotPathText,
    formatJSONPointerText,
} from "../utils/path-text.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type { ListCircularPathsParams } from "./list-circular-paths.types.js";

const circularFields = ["value", "pathStyle", "pathDelimiter"] as const;

interface ResolvedCircular {
    pathDelimiter: string;
    pathStyle: PathStyle;
    value: unknown;
}

/**
 * Lists the paths of edges that point at an ancestor.
 *
 * Pass a value, or `{ value, pathStyle, pathDelimiter }`. The walk covers
 * the same children as `forEachChild`. An unknown `pathStyle` is `"dot"`.
 * Acyclic values and primitives return an empty array. The function does
 * not throw for bad options or cycles, and it does not mutate the input.
 *
 * @param value - Any value.
 * @returns The formatted paths, in depth-first order.
 * @example
 * const box: { self?: object } = {};
 * box.self = box;
 * listCircularPaths(box);
 */
/**
 * @param params - The value and the path format.
 */
export function listCircularPaths(params: ListCircularPathsParams): string[];
/**
 * @param value - Any value.
 */
export function listCircularPaths(value: unknown): string[];
/**
 * @param valueOrParams - A value or the options object.
 */
export function listCircularPaths(valueOrParams: unknown): string[] {
    const resolved = resolveCircular(valueOrParams);
    const paths: string[] = [];
    collectCycles(
        resolved.value,
        [],
        new Set(),
        paths,
        resolved.pathStyle,
        resolved.pathDelimiter,
    );
    return paths;
}

/**
 * Reads a bare value or the options object.
 *
 * Invalid style and delimiter fall back instead of throwing.
 *
 * @param valueOrParams - The argument passed to `listCircularPaths`.
 * @returns The value and the format that will be used.
 */
function resolveCircular(valueOrParams: unknown): ResolvedCircular {
    if (!isParameterRecord(valueOrParams, "value", circularFields)) {
        return {
            pathDelimiter: defaultPathDelimiter,
            pathStyle: "dot",
            value: valueOrParams,
        };
    }
    return {
        pathDelimiter: readDelimiter(valueOrParams.pathDelimiter),
        pathStyle: readStyle(valueOrParams.pathStyle),
        value: valueOrParams.value,
    };
}

/**
 * Reads a path style, falling back to `"dot"`.
 *
 * @param value - The option the caller passed.
 * @returns `"json-pointer"` or `"dot"`.
 */
function readStyle(value: unknown): PathStyle {
    if (value === "json-pointer") {
        return "json-pointer";
    }
    return "dot";
}

/**
 * Reads a delimiter, falling back to `"."`.
 *
 * @param value - The option the caller passed.
 * @returns A non-empty separator.
 */
function readDelimiter(value: unknown): string {
    if (typeof value === "string" && value.length > 0) {
        return value;
    }
    return defaultPathDelimiter;
}

/**
 * Records cycle edges under `value`.
 *
 * Ancestors are removed after the node so a later sibling can point at it
 * without being treated as a cycle. A child that is an ancestor is recorded
 * and not entered.
 *
 * @param value - The current value.
 * @param path - Segments from the root.
 * @param ancestors - Objects on the path from the root.
 * @param paths - Formatted cycle paths. This array is mutated.
 * @param pathStyle - How a cycle path is formatted.
 * @param pathDelimiter - The dot-path separator.
 * @returns Nothing.
 */
function collectCycles(
    value: unknown,
    path: readonly PathSegment[],
    ancestors: Set<object>,
    paths: string[],
    pathStyle: PathStyle,
    pathDelimiter: string,
): void {
    if (!isObjectLikeValue(value) || ancestors.has(value)) {
        return;
    }
    ancestors.add(value);
    forEachChild(value, (child, key) => {
        const edge = [...path, segmentFor(key)];
        if (isObjectLikeValue(child) && ancestors.has(child)) {
            const text = formatCycle(edge, pathStyle, pathDelimiter);
            if (text !== undefined) {
                paths.push(text);
            }
            return;
        }
        collectCycles(child, edge, ancestors, paths, pathStyle, pathDelimiter);
    });
    ancestors.delete(value);
}

/**
 * Turns a child key into a path segment.
 *
 * @param key - The key `forEachChild` reported.
 * @returns A string or number segment.
 */
function segmentFor(key: PropertyKey): PathSegment {
    if (typeof key === "number" && Number.isFinite(key)) {
        return key;
    }
    if (typeof key === "string") {
        return key;
    }
    if (typeof key === "symbol") {
        return key.toString();
    }
    return "value";
}

/**
 * Formats one cycle path.
 *
 * @param path - Segments from the root to the cycling edge.
 * @param pathStyle - `"dot"` or `"json-pointer"`.
 * @param pathDelimiter - The dot-path separator.
 * @returns The path text, or `undefined` when it cannot be formatted.
 */
function formatCycle(
    path: readonly PathSegment[],
    pathStyle: PathStyle,
    pathDelimiter: string,
): string | undefined {
    if (pathStyle === "json-pointer") {
        return formatJSONPointerText(path);
    }
    return formatDotPathText(path, pathDelimiter);
}
