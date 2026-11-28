import type { Iteratee } from "../types/iteratee.types.js";
import type { GetUniqueSortedParams } from "./get-unique-sorted.types.js";
import { sameValueZero } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Drops adjacent duplicates from an array that is already sorted.
 *
 * This is one pass. It is not a full unique: a later repeat that is not
 * next to its twin is kept. Comparison is SameValueZero on the key, or on
 * the item when `by` is omitted. `NaN` matches `NaN`, and `-0` matches `0`.
 * The input is not mutated.
 *
 * @param params - A sorted `array` and an optional `by`.
 * @returns A new array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is present and is not an iteratee.
 * @example
 * getUniqueSorted({ array: [1, 1, 2, 2, 3, 1] })
 */
export function getUniqueSorted<Item>(
    params: GetUniqueSortedParams<Item>,
): Item[] | undefined;
export function getUniqueSorted(params: unknown): unknown[] | undefined;
export function getUniqueSorted(params: unknown): unknown[] | undefined {
    const resolved = readParams<GetUniqueSortedParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const read = readKey<unknown>(resolved.by);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return dropAdjacent(array, read);
}

/**
 * Resolves `by` when it is present.
 *
 * @param by - An optional iteratee.
 * @returns A key reader. The item itself is the key when `by` is omitted.
 * @throws {@link TypeError} When `by` is present and is not an iteratee.
 */
function readKey<Item>(
    by: unknown,
): (item: Item, index: number, array: readonly Item[]) => unknown {
    if (by === undefined) {
        return (item: Item) => item;
    }
    assertIteratee("by", by);
    return resolveIteratee(by as Iteratee<Item>);
}

/**
 * Copies items, skipping a key that matches the previous key.
 *
 * @param array - The source array.
 * @param read - Key reader.
 * @returns Items with adjacent duplicates removed.
 */
function dropAdjacent<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Item[] {
    const result: Item[] = [];
    let previousKey: unknown;
    let hasPrevious = false;
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = read(item, index, array);
        if (hasPrevious && sameValueZero(key, previousKey)) {
            continue;
        }
        result.push(item);
        previousKey = key;
        hasPrevious = true;
    }
    return result;
}
