import type { PathSegment } from "../types/path.types.js";
import { forEachChild } from "../utils/child.utils.js";
import { assertFunction } from "../utils/describe-received.utils.js";
import { isObjectLikeValue } from "../utils/value-kind.utils.js";
import type {
    WalkObjectParams,
    WalkObjectVisit,
    WalkObjectVisitor,
} from "./walk-object.types.js";

interface WalkChild {
    key: PropertyKey;
    value: unknown;
}

interface WalkFrame {
    ancestors: Set<object>;
    includeArrays: boolean;
    leafOnly: boolean;
    maxDepth: number;
    visitor: WalkObjectVisitor;
}

/**
 * Walks a value depth-first and calls `visitor` for each visited node.
 *
 * Plain objects, arrays, class instances, maps, sets, and error causes are
 * walked through `forEachChild`. A cycle is not visited again. `skip` stops
 * the children of the current node. The input is not mutated.
 *
 * @param params - The value, the visitor, and the walk limits.
 * @returns Nothing.
 * @throws {TypeError} When `visitor` is not a function.
 * @example
 * walkObject({
 *     object: { id: 1 },
 *     visitor: ({ value }) => {
 *         value;
 *     },
 * });
 */
export function walkObject(params: WalkObjectParams): void {
    assertFunction(params.visitor, "visitor");
    const maxDepth =
        typeof params.maxDepth === "number"
            ? params.maxDepth
            : Number.POSITIVE_INFINITY;
    visitNode(params.object, [], 0, undefined, undefined, {
        ancestors: new Set(),
        includeArrays: params.includeArrays !== false,
        leafOnly: params.leafOnly === true,
        maxDepth,
        visitor: params.visitor,
    });
}

/**
 * Visits one node and then its children.
 *
 * @param value - The current value.
 * @param path - The path from the root.
 * @param depth - The level of this node. The root is 0.
 * @param parent - The parent container, or `undefined` at the root.
 * @param key - The key that selected this node, or `undefined` at the root.
 * @param frame - Limits and the visitor.
 * @returns Nothing.
 */
function visitNode(
    value: unknown,
    path: readonly PathSegment[],
    depth: number,
    parent: unknown,
    key: PropertyKey | undefined,
    frame: WalkFrame,
): void {
    if (depth > frame.maxDepth) {
        return;
    }
    if (isObjectLikeValue(value) && frame.ancestors.has(value)) {
        return;
    }
    const children = listChildren(value, frame.includeArrays);
    let skipped = false;
    if (!frame.leafOnly || children.length === 0) {
        const visit: WalkObjectVisit = {
            path,
            skip: () => {
                skipped = true;
            },
            value,
        };
        if (key !== undefined) {
            visit.key = key;
        }
        if (parent !== undefined) {
            visit.parent = parent;
        }
        frame.visitor(visit);
    }
    if (skipped || children.length === 0 || depth >= frame.maxDepth) {
        return;
    }
    if (!isObjectLikeValue(value)) {
        return;
    }
    frame.ancestors.add(value);
    for (const child of children) {
        visitNode(
            child.value,
            childPath(path, child.key),
            depth + 1,
            value,
            child.key,
            frame,
        );
    }
    frame.ancestors.delete(value);
}

/**
 * Lists the children this walk would enter.
 *
 * @param value - The current value.
 * @param includeArrays - Whether array elements are children.
 * @returns The children, in walk order. Empty for leaves.
 */
function listChildren(value: unknown, includeArrays: boolean): WalkChild[] {
    if (!isObjectLikeValue(value)) {
        return [];
    }
    if (!includeArrays && Array.isArray(value)) {
        return [];
    }
    const children: WalkChild[] = [];
    forEachChild(value, (child, key) => {
        children.push({ key, value: child });
    });
    return children;
}

/**
 * Appends a string or number key to `path`.
 *
 * Other keys stay on `visit.key` and are not path segments.
 *
 * @param path - The parent path.
 * @param key - The child key.
 * @returns A new path.
 */
function childPath(
    path: readonly PathSegment[],
    key: PropertyKey,
): PathSegment[] {
    if (typeof key === "string" || typeof key === "number") {
        return [...path, key];
    }
    return [...path];
}
