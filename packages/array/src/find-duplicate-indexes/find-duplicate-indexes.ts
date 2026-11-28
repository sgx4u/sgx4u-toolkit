import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { FindDuplicateIndexesParams } from "./find-duplicate-indexes.types.js";
import { resolveEquals, sameValueZero } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

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
 * Returns every index of each value that appears more than once.
 *
 * The first index is included. `[1, 2, 1, 3, 2]` returns `[0, 1, 2, 4]`.
 * The indexes are ascending. `by` wins over `equals`.
 *
 * @param params - `array`, and optional `by` or `equals`.
 * @returns The indexes, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is present and is not an iteratee, or when `by` is omitted and `equals` is not a function.
 * @example
 * findDuplicateIndexes({ array: [1, 2, 1, 3, 2] })
 */
export function findDuplicateIndexes<Item>(
    params: FindDuplicateIndexesParams<Item>,
): number[] | undefined;
export function findDuplicateIndexes(params: unknown): number[] | undefined;
export function findDuplicateIndexes(params: unknown): number[] | undefined {
    const resolved = readParams<FindDuplicateIndexesParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const comparison = readComparison<unknown>(resolved.by, resolved.equals);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const groups =
        comparison.kind === "key"
            ? indexesByKey(array, comparison.read)
            : indexesByEquals(array, comparison.equals);
    const result: number[] = [];
    for (const indexes of groups) {
        if (indexes.length > 1) {
            for (const index of indexes) {
                result.push(index);
            }
        }
    }
    result.sort((left, right) => left - right);
    return result;
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
 * @param array - The source array.
 * @param read - Key reader.
 * @returns Index lists, one per first-seen key.
 */
function indexesByKey<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): number[][] {
    const groups: number[][] = [];
    const indexes = new Map<unknown, number>();
    for (let index = 0; index < array.length; index += 1) {
        const key = read(array[index] as Item, index, array);
        const groupIndex = indexes.get(key);
        if (groupIndex === undefined) {
            indexes.set(key, groups.length);
            groups.push([index]);
            continue;
        }
        const group = groups[groupIndex] as number[];
        group.push(index);
    }
    return groups;
}

/**
 * @param array - The source array.
 * @param equals - Item equality.
 * @returns Index lists, one per first-seen item.
 */
function indexesByEquals<Item>(
    array: readonly Item[],
    equals: Equals<Item>,
): number[][] {
    if (equals === (sameValueZero as Equals<Item>)) {
        return indexesByKey(array, (item) => item);
    }
    const items: Item[] = [];
    const groups: number[][] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        let groupIndex = -1;
        for (let candidate = 0; candidate < items.length; candidate += 1) {
            if (equals(items[candidate] as Item, item)) {
                groupIndex = candidate;
                break;
            }
        }
        if (groupIndex < 0) {
            items.push(item);
            groups.push([index]);
            continue;
        }
        const group = groups[groupIndex] as number[];
        group.push(index);
    }
    return groups;
}
