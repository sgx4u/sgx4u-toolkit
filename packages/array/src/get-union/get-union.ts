import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { GetUnionParams } from "./get-union.types.js";
import { createMembership, resolveEquals } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

/**
 * One way to decide that two items are the same.
 */
type ItemComparison<Item> =
    | {
          kind: "key";
          read: (item: Item, index: number, array: readonly Item[]) => unknown;
      }
    | { kind: "equals"; equals: Equals<Item> };

/**
 * Keeps the first-seen item from every array.
 *
 * One membership is shared across the whole list, so a value that appears
 * in a later array is dropped when an earlier array already had it. `by`
 * wins over `equals`: the key is compared with SameValueZero, and the
 * stored value is the original item. An empty list returns `[]`.
 *
 * @param params - `arrays`, and optional `by` or `equals`.
 * @returns The union, or `undefined` when `arrays` is not an array of arrays.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or when `by` is omitted and `equals` is not a function.
 * @example
 * getUnion({ arrays: [[1, 2], [2, 3]] })
 */
export function getUnion<Item>(
    params: GetUnionParams<Item>,
): Item[] | undefined;
export function getUnion(params: unknown): unknown[] | undefined;
export function getUnion(params: unknown): unknown[] | undefined {
    const resolved = readParams<GetUnionParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    if (comparison.kind === "key") {
        return unionByKey(arrays, comparison.read);
    }
    return unionByEquals(arrays, comparison.equals);
}

/**
 * Resolves `by` or `equals`. `by` wins.
 *
 * @param by - An optional iteratee.
 * @param equals - An optional comparer, used only when `by` is omitted.
 * @returns The comparison to use.
 * @throws {@link TypeError} When the selected option has the wrong type.
 */
function readComparison<Item>(
    by: unknown,
    equals: unknown,
): ItemComparison<Item> {
    if (by !== undefined) {
        assertIteratee("by", by);
        return { kind: "key", read: resolveIteratee(by as Iteratee<Item>) };
    }
    return {
        kind: "equals",
        equals: resolveEquals(equals as Equals<Item> | undefined),
    };
}

/**
 * @param arrays - Arrays of items.
 * @param read - Key reader.
 * @returns First-seen items.
 */
function unionByKey<Item>(
    arrays: readonly (readonly Item[])[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Item[] {
    const seen = new Set<unknown>();
    const result: Item[] = [];
    for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
        const array = arrays[arrayIndex] as readonly Item[];
        for (let index = 0; index < array.length; index += 1) {
            const item = array[index] as Item;
            const key = read(item, index, array);
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            result.push(item);
        }
    }
    return result;
}

/**
 * @param arrays - Arrays of items.
 * @param equals - Item equality.
 * @returns First-seen items.
 */
function unionByEquals<Item>(
    arrays: readonly (readonly Item[])[],
    equals: Equals<Item>,
): Item[] {
    const membership = createMembership(equals);
    const result: Item[] = [];
    for (let arrayIndex = 0; arrayIndex < arrays.length; arrayIndex += 1) {
        const array = arrays[arrayIndex] as readonly Item[];
        for (let index = 0; index < array.length; index += 1) {
            const item = array[index] as Item;
            if (membership.has(item)) {
                continue;
            }
            membership.add(item);
            result.push(item);
        }
    }
    return result;
}
