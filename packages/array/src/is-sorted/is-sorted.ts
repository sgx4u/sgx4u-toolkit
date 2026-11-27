import type { SortKey } from "../types/sort.types.js";
import type { PreparedSortKey, SortDefaults } from "../utils/sort.utils.js";
import type { IsSortedParams } from "./is-sorted.types.js";
import { readArray, readParams } from "../utils/params.utils.js";
import {
    assertSortDefaults,
    comparePreparedItems,
    normalizeSortKeys,
} from "../utils/sort.utils.js";

/**
 * Reports whether each item is less than or equal to the next item.
 *
 * The comparison uses the same rules as {@link sortBy}. An empty array and
 * a one-item array are sorted, even when `keys` or the options would be
 * invalid. A non-array returns `false`. When the array has more than one
 * item and the keys or options are invalid, the result is `false`. This
 * function does not throw for those mistakes. When `keys` is omitted, the
 * items themselves are compared with the call-level direction.
 *
 * @param params - `array` and optional sort keys.
 * @returns `true` when the array is ordered.
 * @example
 * isSorted({ array: [1, 2, 3], locale: "en-US" })
 */
export function isSorted<Item>(params: IsSortedParams<Item>): boolean;
export function isSorted(params: unknown): boolean;
export function isSorted(params: unknown): boolean {
    const resolved = readParams<IsSortedParams<unknown>>(params);
    if (resolved === undefined) {
        return false;
    }
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return false;
    }
    if (array.length <= 1) {
        return true;
    }
    const keys = readKeys(resolved);
    if (keys === undefined) {
        return false;
    }
    for (let index = 1; index < array.length; index += 1) {
        const comparison = comparePreparedItems(
            array[index - 1] as unknown,
            index - 1,
            array[index] as unknown,
            index,
            array,
            keys,
        );
        if (comparison > 0) {
            return false;
        }
    }
    return true;
}

/**
 * Normalizes keys, turning invalid options into `undefined`.
 *
 * @param params - Call-level options. `array` is already known to be long enough to care.
 * @returns Normalized keys, or `undefined` when the options throw.
 */
function readKeys(
    params: IsSortedParams<unknown>,
): PreparedSortKey<unknown>[] | undefined {
    try {
        const defaults = assertSortDefaults(sortDefaultsFrom(params));
        const source =
            params.keys === undefined
                ? [((item: unknown) => item) as SortKey<unknown>]
                : params.keys;
        return normalizeSortKeys(source, defaults);
    } catch (error) {
        if (error instanceof RangeError || error instanceof TypeError) {
            return undefined;
        }
        throw error;
    }
}

/**
 * Copies defined sort options into a defaults object.
 *
 * @param source - Call-level options.
 * @returns Options safe to validate.
 */
function sortDefaultsFrom(source: IsSortedParams<unknown>): SortDefaults {
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
