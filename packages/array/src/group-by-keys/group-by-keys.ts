import type { Iteratee } from "../types/iteratee.types.js";
import type { GroupByKeysParams } from "./group-by-keys.types.js";
import { copyArray } from "../utils/array.utils.js";
import { typeError } from "../utils/errors.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Groups items once for each key, nesting one plain object per key.
 *
 * The deepest level is an `Item[]`. An empty `keys` list returns a shallow
 * copy of `array`. Record keys are `String(key)`, so distinct objects share
 * `"[object Object]"`. A symbol key uses `Symbol.prototype.toString`. The
 * return type is `unknown` because the depth follows `keys`.
 *
 * Each iteratee is called with the item, its index in the group being
 * split, and that group. The first key sees the original array.
 *
 * @param params - `array` and a list of iteratees.
 * @returns The nested groups, a shallow copy when `keys` is empty, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `keys` is not an array, or any entry is not an iteratee.
 * @example
 * groupByKeys({ array: [{ city: "Paris" }], keys: ["city"] })
 */
export function groupByKeys<Item>(params: GroupByKeysParams<Item>): unknown;
export function groupByKeys(params: unknown): unknown;
export function groupByKeys(params: unknown): unknown {
    const resolved = readParams<GroupByKeysParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (!Array.isArray(resolved.keys)) {
        throw typeError("keys", "an array", resolved.keys);
    }
    for (const key of resolved.keys) {
        assertIteratee("keys", key);
    }
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const readers = (resolved.keys as readonly Iteratee<unknown>[]).map((key) =>
        resolveIteratee(key),
    );
    if (readers.length === 0) {
        return copyArray(array);
    }
    return nestGroups(array, readers, 0);
}

/**
 * Groups `array` at `depth`, then groups each bucket by the next key.
 *
 * @param array - The items that share the keys above this level.
 * @param readers - Resolved iteratees, outer key first.
 * @param depth - Which reader to apply.
 * @returns A record, or an `Item[]` at the last level.
 */
function nestGroups<Item>(
    array: readonly Item[],
    readers: readonly ((
        item: Item,
        index: number,
        array: readonly Item[],
    ) => unknown)[],
    depth: number,
): Record<string, unknown> {
    const read = readers[depth] as (
        item: Item,
        index: number,
        array: readonly Item[],
    ) => unknown;
    const buckets = new Map<string, Item[]>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = stringKey(read(item, index, array));
        const existing = buckets.get(key);
        if (existing === undefined) {
            buckets.set(key, [item]);
            continue;
        }
        existing.push(item);
    }
    const result: Record<string, unknown> = {};
    const lastLevel = depth === readers.length - 1;
    for (const [key, items] of buckets) {
        result[key] = lastLevel ? items : nestGroups(items, readers, depth + 1);
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
