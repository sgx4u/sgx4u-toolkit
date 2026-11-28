import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { GetIntersectionParams } from "./get-intersection.types.js";
import {
    createMembership,
    membershipFrom,
    resolveEquals,
    uniqueInOrder,
} from "../utils/equality.utils.js";
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
 * Keeps items from the first array that appear in every later array.
 *
 * The result is unique and stays in first-seen order. One array returns
 * that array's unique items. An empty list returns `[]`, not `undefined`.
 * `by` wins over `equals`. The stored value is the item from the first array.
 *
 * @param params - `arrays`, and optional `by` or `equals`.
 * @returns The intersection, or `undefined` when `arrays` is not an array of arrays.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or when `by` is omitted and `equals` is not a function.
 * @example
 * getIntersection({ arrays: [[1, 2, 2], [2, 3], [2, 4]] })
 */
export function getIntersection<Item>(
    params: GetIntersectionParams<Item>,
): Item[] | undefined;
export function getIntersection(params: unknown): unknown[] | undefined;
export function getIntersection(params: unknown): unknown[] | undefined {
    const resolved = readParams<GetIntersectionParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    if (comparison.kind === "key") {
        return intersectionByKey(arrays, comparison.read);
    }
    return intersectionByEquals(arrays, comparison.equals);
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
 * @param arrays - Arrays of items. The first array supplies the result.
 * @param read - Key reader.
 * @returns Items present in every array.
 */
function intersectionByKey<Item>(
    arrays: readonly (readonly Item[])[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Item[] {
    const first = arrays[0] as readonly Item[] | undefined;
    if (first === undefined) {
        return [];
    }
    const later = keySets(arrays, read);
    const seen = new Set<unknown>();
    const result: Item[] = [];
    for (let index = 0; index < first.length; index += 1) {
        const item = first[index] as Item;
        const key = read(item, index, first);
        if (seen.has(key)) {
            continue;
        }
        if (!later.every((keys) => keys.has(key))) {
            continue;
        }
        seen.add(key);
        result.push(item);
    }
    return result;
}

/**
 * Builds a key set for every array after the first.
 *
 * @param arrays - Arrays of items.
 * @param read - Key reader.
 * @returns One set per later array.
 */
function keySets<Item>(
    arrays: readonly (readonly Item[])[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Set<unknown>[] {
    const sets: Set<unknown>[] = [];
    for (let arrayIndex = 1; arrayIndex < arrays.length; arrayIndex += 1) {
        const array = arrays[arrayIndex] as readonly Item[];
        const keys = new Set<unknown>();
        for (let index = 0; index < array.length; index += 1) {
            keys.add(read(array[index] as Item, index, array));
        }
        sets.push(keys);
    }
    return sets;
}

/**
 * @param arrays - Arrays of items. The first array supplies the result.
 * @param equals - Item equality.
 * @returns Items present in every array.
 */
function intersectionByEquals<Item>(
    arrays: readonly (readonly Item[])[],
    equals: Equals<Item>,
): Item[] {
    const first = arrays[0] as readonly Item[] | undefined;
    if (first === undefined) {
        return [];
    }
    if (arrays.length === 1) {
        return uniqueInOrder(first, equals, "first");
    }
    const memberships = [];
    for (let arrayIndex = 1; arrayIndex < arrays.length; arrayIndex += 1) {
        memberships.push(
            membershipFrom(arrays[arrayIndex] as readonly Item[], equals),
        );
    }
    const kept = createMembership(equals);
    const result: Item[] = [];
    for (let index = 0; index < first.length; index += 1) {
        const item = first[index] as Item;
        if (kept.has(item)) {
            continue;
        }
        if (!memberships.every((membership) => membership.has(item))) {
            continue;
        }
        kept.add(item);
        result.push(item);
    }
    return result;
}
