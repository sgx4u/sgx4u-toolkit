import type { Iteratee } from "../types/iteratee.types.js";
import type { UniqueKeep } from "../get-unique-items/get-unique-items.types.js";
import type { GetUniqueItemsByParams } from "./get-unique-items-by.types.js";
import { assertChoice } from "../utils/errors.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

const keepNames = ["first", "last"] as const;

/**
 * Drops items whose `by` result was already seen.
 *
 * Comparison is SameValueZero on the key, including when `equals` would
 * have been used by {@link getUniqueItems}. `NaN` matches `NaN`, and `-0`
 * matches `0`. Objects match by reference. `keep` defaults to `"first"`.
 * `"last"` keeps the later item, in the order those later items appear.
 * The stored value is the original item, not the key.
 *
 * @param params - `array`, `by`, and optional `keep`.
 * @returns The kept items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is not a property key or a function.
 * @throws {@link RangeError} When `keep` is not `"first"` or `"last"`.
 * @example
 * getUniqueItemsBy({ array: [{ id: 1 }, { id: 1 }], by: "id" })
 */
export function getUniqueItemsBy<Item>(
    params: GetUniqueItemsByParams<Item>,
): Item[] | undefined;
export function getUniqueItemsBy(params: unknown): unknown[] | undefined;
export function getUniqueItemsBy(params: unknown): unknown[] | undefined {
    const resolved = readParams<GetUniqueItemsByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertIteratee("by", resolved.by);
    assertChoice("keep", resolved.keep, keepNames);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const read = resolveIteratee(resolved.by as Iteratee<unknown>);
    const keep: UniqueKeep = resolved.keep ?? "first";
    return uniqueByKey(array, read, keep);
}

/**
 * Keeps the first or last item for each key.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @param keep - Which occurrence to keep.
 * @returns A new array of kept items.
 */
function uniqueByKey<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
    keep: UniqueKeep,
): Item[] {
    const keys = readKeys(array, read);
    if (keep === "first") {
        return keepFirst(array, keys);
    }
    return keepLast(array, keys);
}

/**
 * Reads each key once.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @returns One key per item, in the same order.
 */
function readKeys<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): unknown[] {
    const keys: unknown[] = [];
    for (let index = 0; index < array.length; index += 1) {
        keys.push(read(array[index] as Item, index, array));
    }
    return keys;
}

/**
 * @param array - The source array.
 * @param keys - Keys aligned with `array`.
 * @returns The first item for each key.
 */
function keepFirst<Item>(
    array: readonly Item[],
    keys: readonly unknown[],
): Item[] {
    const seen = new Set<unknown>();
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const key = keys[index] as unknown;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        result.push(array[index] as Item);
    }
    return result;
}

/**
 * @param array - The source array.
 * @param keys - Keys aligned with `array`.
 * @returns The last item for each key, in the order of those last items.
 */
function keepLast<Item>(
    array: readonly Item[],
    keys: readonly unknown[],
): Item[] {
    const lastIndex = new Map<unknown, number>();
    for (let index = 0; index < keys.length; index += 1) {
        lastIndex.set(keys[index] as unknown, index);
    }
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        if (lastIndex.get(keys[index] as unknown) === index) {
            result.push(array[index] as Item);
        }
    }
    return result;
}
