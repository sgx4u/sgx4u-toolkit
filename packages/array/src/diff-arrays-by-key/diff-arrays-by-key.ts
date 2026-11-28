import type { DiffArraysByKeyParams } from "./diff-arrays-by-key.types.js";
import type { KeyedArrayDiff } from "../types/patch.types.js";
import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Compares two arrays by key.
 *
 * Identity is the key, compared with SameValueZero. `equals` decides whether
 * two items that share a key are updated or unchanged. `moved` is the same
 * key and equal values whose index changed. A new key is added. A missing
 * key is removed.
 *
 * The first occurrence of a key is the primary item. A later duplicate on
 * `first` is an extra removal, and a later duplicate on `second` is an extra
 * addition. Extras are interleaved with the other changes in appearance
 * order. A changed value is `updated` only, even when its index also changed.
 *
 * Indexes are the index of the first occurrence of that key on each side.
 * Either side not being an array returns `undefined`. The inputs are not
 * mutated.
 *
 * @param input - {@link DiffArraysByKeyParams}.
 * @returns The keyed diff, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `key` is not an iteratee, or when `equals` is present and is not a function.
 * @example
 * diffArraysByKey({
 *   first: [{ id: 1, name: "a" }],
 *   second: [{ id: 1, name: "b" }],
 *   key: "id",
 * })
 */
export function diffArraysByKey<Item>(
    params: DiffArraysByKeyParams<Item>,
): KeyedArrayDiff<Item> | undefined;
export function diffArraysByKey(
    input: unknown,
): KeyedArrayDiff<unknown> | undefined;
export function diffArraysByKey(
    input: unknown,
): KeyedArrayDiff<unknown> | undefined {
    const params = readParams<DiffArraysByKeyParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const first = readArray(params.first);
    const second = readArray(params.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    assertIteratee("key", params.key);
    return diffByKey(first, second, params.key, resolveEquals(params.equals));
}

interface KeyEntry {
    item: unknown;
    key: unknown;
    index: number;
    duplicate: boolean;
}

/**
 * @param first - The previous array.
 * @param second - The next array.
 * @param key - An iteratee. Already checked.
 * @param equals - Item equality.
 * @returns Added, removed, updated, moved, and unchanged items.
 */
function diffByKey(
    first: readonly unknown[],
    second: readonly unknown[],
    key: Iteratee<unknown>,
    equals: Equals<unknown>,
): KeyedArrayDiff<unknown> {
    const firstEntries = readEntries(first, key);
    const secondEntries = readEntries(second, key);
    const firstPrimary = primaryMap(firstEntries);
    const secondPrimary = primaryMap(secondEntries);
    const added: unknown[] = [];
    const updated: Array<{ previous: unknown; next: unknown }> = [];
    const moved: Array<{ item: unknown; from: number; to: number }> = [];
    const unchanged: unknown[] = [];
    for (const entry of secondEntries) {
        if (entry.duplicate) {
            added.push(entry.item);
            continue;
        }
        const previous = firstPrimary.get(entry.key);
        if (previous === undefined) {
            added.push(entry.item);
            continue;
        }
        if (!equals(previous.item, entry.item)) {
            updated.push({ previous: previous.item, next: entry.item });
            continue;
        }
        if (previous.index !== entry.index) {
            moved.push({
                item: entry.item,
                from: previous.index,
                to: entry.index,
            });
            continue;
        }
        unchanged.push(entry.item);
    }
    const removed: unknown[] = [];
    for (const entry of firstEntries) {
        if (entry.duplicate || !secondPrimary.has(entry.key)) {
            removed.push(entry.item);
        }
    }
    return { added, removed, updated, moved, unchanged };
}

/**
 * @param array - One side of the diff.
 * @param key - An iteratee.
 * @returns Every item, marked when its key was already seen.
 */
function readEntries(
    array: readonly unknown[],
    key: Iteratee<unknown>,
): KeyEntry[] {
    const read = resolveIteratee(key);
    const entries: KeyEntry[] = [];
    const seenKeys = new Map<unknown, true>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as unknown;
        const itemKey = read(item, index, array);
        const duplicate = seenKeys.has(itemKey);
        if (!duplicate) {
            seenKeys.set(itemKey, true);
        }
        entries.push({ item, key: itemKey, index, duplicate });
    }
    return entries;
}

/**
 * @param entries - Items in appearance order.
 * @returns The first occurrence of each key.
 */
function primaryMap(entries: readonly KeyEntry[]): Map<unknown, KeyEntry> {
    const primary = new Map<unknown, KeyEntry>();
    for (const entry of entries) {
        if (!entry.duplicate) {
            primary.set(entry.key, entry);
        }
    }
    return primary;
}
