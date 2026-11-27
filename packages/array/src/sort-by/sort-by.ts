import type { PreparedSortKey, SortDefaults } from "../utils/sort.utils.js";
import type { SortByParams } from "./sort-by.types.js";
import { copyArray } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import {
    assertSortDefaults,
    compareSortKeys,
    normalizeSortKeys,
} from "../utils/sort.utils.js";

/**
 * One item, its original index, and the keys already read from it.
 */
interface Decorated<Item> {
    item: Item;
    index: number;
    values: unknown[];
}

/**
 * Sorts a copy of `array` by one or more keys.
 *
 * The sort is stable: equal keys keep their input order. Later keys break
 * ties. A key's direction, locale, numeric mode, sensitivity, and null
 * placement override the call-level defaults. `null`, `undefined`, and
 * `NaN` use `nulls` (default `"last"`), and that placement does not flip
 * when the direction is descending. An empty `keys` list returns a shallow
 * copy. Each key function is called once, with the item, its original
 * index, and the source array.
 *
 * @param params - `array`, `keys`, and optional locale options.
 * @returns The sorted copy, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `keys` is not an array, a key is not an iteratee, `numeric` is not a boolean, or `locale` has the wrong type.
 * @throws {@link RangeError} When `direction`, `sensitivity`, `nulls`, or `locale` is not an allowed value.
 * @example
 * sortBy({ array: ["item10", "item2"], keys: [(item) => item], numeric: true, locale: "en-US" })
 */
export function sortBy<Item>(params: SortByParams<Item>): Item[] | undefined;
export function sortBy(params: unknown): unknown[] | undefined;
export function sortBy(params: unknown): unknown[] | undefined {
    const resolved = readParams<SortByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const defaults = assertSortDefaults(sortDefaultsFrom(resolved));
    const keys = normalizeSortKeys(resolved.keys, defaults);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return sortStable(array, keys);
}

/**
 * Copies defined sort options into a defaults object.
 *
 * Omitted options stay omitted so a default inside the sort helper can apply.
 *
 * @param source - Call-level options.
 * @returns Options safe to validate.
 */
function sortDefaultsFrom(source: SortByParams<unknown>): SortDefaults {
    const defaults: SortDefaults = {};
    if (source.direction !== undefined) {
        defaults.direction = source.direction;
    }
    if (source.locale !== undefined) {
        defaults.locale = source.locale;
    }
    if (source.numeric !== undefined) {
        defaults.numeric = source.numeric;
    }
    if (source.sensitivity !== undefined) {
        defaults.sensitivity = source.sensitivity;
    }
    if (source.nulls !== undefined) {
        defaults.nulls = source.nulls;
    }
    return defaults;
}

/**
 * Sorts by precomputed keys and uses the original index to break ties.
 *
 * @param array - The source array.
 * @param keys - Normalized keys. Empty means a shallow copy.
 * @returns A new array.
 */
function sortStable<Item>(
    array: readonly Item[],
    keys: readonly PreparedSortKey<Item>[],
): Item[] {
    if (keys.length === 0) {
        return copyArray(array);
    }
    const decorated = decorate(array, keys);
    const sorted = decorated.toSorted((left, right) =>
        compareDecorated(left, right, keys),
    );
    const result: Item[] = [];
    for (const entry of sorted) {
        result.push(entry.item);
    }
    return result;
}

/**
 * Reads every key once.
 *
 * @param array - The source array.
 * @param keys - Normalized keys.
 * @returns Decorated items in input order.
 */
function decorate<Item>(
    array: readonly Item[],
    keys: readonly PreparedSortKey<Item>[],
): Decorated<Item>[] {
    const decorated: Decorated<Item>[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const values: unknown[] = [];
        for (const key of keys) {
            values.push(key.read(item, index, array));
        }
        decorated.push({ item, index, values });
    }
    return decorated;
}

/**
 * Compares precomputed keys, then the original index.
 *
 * @param left - The left decorated item.
 * @param right - The right decorated item.
 * @param keys - Normalized keys, aligned with `values`.
 * @returns A negative number, zero, or a positive number.
 */
function compareDecorated<Item>(
    left: Decorated<Item>,
    right: Decorated<Item>,
    keys: readonly PreparedSortKey<Item>[],
): number {
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex += 1) {
        const key = keys[keyIndex] as PreparedSortKey<Item>;
        const comparison = compareSortKeys(
            left.values[keyIndex] as unknown,
            right.values[keyIndex] as unknown,
            key.direction,
            key.nulls,
            key.collator,
        );
        if (comparison !== 0) {
            return comparison;
        }
    }
    return left.index - right.index;
}
