import type { Iteratee } from "../types/iteratee.types.js";
import type { GroupByParams } from "./group-by.types.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Groups items by a key, keeping the first-seen group order.
 *
 * `asMap: true` returns a `Map`. Map keys are the original `by` results, so
 * `NaN` matches `NaN`, `-0` matches `0`, and distinct objects stay distinct.
 * The default result is a `Record<string, Item[]>`. Those keys are
 * `String(key)`, so distinct objects share `"[object Object]"`. A symbol key
 * uses `Symbol.prototype.toString` because `String(symbol)` throws.
 *
 * Integer-like record keys are still enumerated in numeric order by
 * JavaScript. Every other string key stays in first-seen order.
 *
 * @param params - `array`, `by`, and optional `asMap`.
 * @returns A map when `asMap` is `true`, otherwise a record. `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is not a property key or a function.
 * @example
 * groupBy({ array: ["red", "blue", "red"], by: (item) => item })
 */
export function groupBy<Item>(
    params: GroupByParams<Item> & { asMap: true },
): Map<unknown, Item[]> | undefined;
export function groupBy<Item>(
    params: GroupByParams<Item>,
): Record<string, Item[]> | undefined;
export function groupBy(
    params: unknown,
): Map<unknown, unknown[]> | Record<string, unknown[]> | undefined;
export function groupBy(
    params: unknown,
): Map<unknown, unknown[]> | Record<string, unknown[]> | undefined {
    const resolved = readParams<GroupByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertIteratee("by", resolved.by);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const read = resolveIteratee(resolved.by as Iteratee<unknown>);
    if (resolved.asMap === true) {
        return groupIntoMap(array, read);
    }
    return groupIntoRecord(array, read);
}

/**
 * Groups items under the original key.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @returns A map in first-seen key order.
 */
function groupIntoMap<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Map<unknown, Item[]> {
    const groups = new Map<unknown, Item[]>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = read(item, index, array);
        const existing = groups.get(key);
        if (existing === undefined) {
            groups.set(key, [item]);
            continue;
        }
        existing.push(item);
    }
    return groups;
}

/**
 * Groups items under `String(key)`.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @returns A record in first-seen key order, aside from integer-like keys.
 */
function groupIntoRecord<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Record<string, Item[]> {
    const groups = new Map<string, Item[]>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = stringKey(read(item, index, array));
        const existing = groups.get(key);
        if (existing === undefined) {
            groups.set(key, [item]);
            continue;
        }
        existing.push(item);
    }
    const result: Record<string, Item[]> = {};
    for (const [key, items] of groups) {
        result[key] = items;
    }
    return result;
}

/**
 * Text used as a record key.
 *
 * @param key - The iteratee result.
 * @returns `String(key)`, or the symbol's own text when `key` is a symbol.
 */
function stringKey(key: unknown): string {
    if (typeof key === "symbol") {
        return key.toString();
    }
    return String(key);
}
