import type { FlattenTreeParams } from "./flatten-tree.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertFunction } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Walks a forest in depth-first pre-order and returns the nodes.
 *
 * Each node is emitted before its children. `getChildren` wins over
 * `childrenKey` when it is provided. `childrenKey` defaults to
 * `"children"`. Missing or non-array children make the node a leaf. If an
 * object node is already on the current path, that visit is skipped, so a
 * cycle does not throw or loop. Only object nodes are tracked. The input
 * is not mutated.
 *
 * @param params - The roots and how to read children.
 * @returns The nodes in pre-order, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `getChildren` is present and is not a function.
 * @example
 * flattenTree({
 *     array: [{ id: "a", children: [{ id: "b" }] }],
 * });
 */
export function flattenTree<Item>(
    params: FlattenTreeParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function flattenTree(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function flattenTree(params: unknown): unknown[] | undefined {
    const resolved = readParams<FlattenTreeParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (resolved.getChildren !== undefined) {
        assertFunction("getChildren", resolved.getChildren);
    }
    const array = readArray(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const childrenKey =
        resolved.childrenKey === undefined ? "children" : resolved.childrenKey;
    const getChildren =
        resolved.getChildren === undefined
            ? undefined
            : (resolved.getChildren as (node: unknown) => unknown);
    return walkForest(array, childrenKey, getChildren);
}

/**
 * Emits every node, then its children, skipping objects already on the path.
 *
 * @param array - The roots.
 * @param childrenKey - Property used when `getChildren` is omitted.
 * @param getChildren - Optional child reader. It wins over `childrenKey`.
 * @returns The nodes in pre-order.
 */
function walkForest(
    array: readonly unknown[],
    childrenKey: string,
    getChildren: ((node: unknown) => unknown) | undefined,
): unknown[] {
    const result: unknown[] = [];
    const path = new Set<object>();
    for (let index = 0; index < array.length; index += 1) {
        visitNode(
            readItem(array, index),
            childrenKey,
            getChildren,
            path,
            result,
        );
    }
    return result;
}

/**
 * Emits `node` and then walks its children.
 *
 * An object already on `path` is skipped. The object is removed from the
 * path after its children, so a later branch can visit it again.
 *
 * @param node - The current node.
 * @param childrenKey - Property used when `getChildren` is omitted.
 * @param getChildren - Optional child reader.
 * @param path - Objects on the path from the root to the parent.
 * @param result - Nodes emitted so far.
 */
function visitNode(
    node: unknown,
    childrenKey: string,
    getChildren: ((node: unknown) => unknown) | undefined,
    path: Set<object>,
    result: unknown[],
): void {
    const tracked = isObjectNode(node);
    if (tracked && path.has(node)) {
        return;
    }
    result.push(node);
    if (tracked) {
        path.add(node);
    }
    const children = readChildren(node, childrenKey, getChildren);
    if (children !== undefined) {
        for (let index = 0; index < children.length; index += 1) {
            visitNode(
                readItem(children, index),
                childrenKey,
                getChildren,
                path,
                result,
            );
        }
    }
    if (tracked) {
        path.delete(node);
    }
}

/**
 * @param node - Any value.
 * @returns `true` when `node` can take part in a cycle.
 */
function isObjectNode(node: unknown): node is object {
    return typeof node === "object" && node !== null;
}

/**
 * @param node - The current node.
 * @param childrenKey - Property used when `getChildren` is omitted.
 * @param getChildren - Optional child reader. It wins over `childrenKey`.
 * @returns The child array, or `undefined` when the node is a leaf.
 */
function readChildren(
    node: unknown,
    childrenKey: string,
    getChildren: ((node: unknown) => unknown) | undefined,
): readonly unknown[] | undefined {
    if (getChildren !== undefined) {
        const children = getChildren(node);
        return Array.isArray(children) ? children : undefined;
    }
    if (!isObjectNode(node)) {
        return undefined;
    }
    const children = (node as Record<string, unknown>)[childrenKey];
    return Array.isArray(children) ? children : undefined;
}
