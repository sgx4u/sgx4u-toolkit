import type { Direction } from "../types/sort.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { SortDefaults } from "../utils/sort.utils.js";
import type { InsertSortedParams } from "./insert-sorted.types.js";
import { copyArray } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import {
    compareSortKeys,
    searchComparison,
    searchKeyReader,
} from "../utils/sort.utils.js";

/**
 * The pieces of one ascending search.
 */
interface SearchPlan<Item> {
    array: readonly Item[];
    value: Item;
    read: (item: Item) => unknown;
    target: unknown;
    collator: Intl.Collator;
    nulls: "first" | "last";
    direction: Direction;
}

/**
 * Copies `array` and inserts `value` at the bisect-left index.
 *
 * The array is assumed sorted ascending, with nullish keys and `NaN` last.
 * Equal values are inserted before the existing matches. The input is not
 * mutated. A function `by` is called with the item, index `0`, and a
 * one-element array.
 *
 * @param params - A sorted `array`, `value`, and optional `by`, `locale`, and `numeric`.
 * @returns A new array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is not an iteratee, `numeric` is not a boolean, or `locale` has the wrong type.
 * @throws {@link RangeError} When `locale` is not a valid BCP 47 tag.
 * @example
 * insertSorted({ array: [1, 3, 5], value: 4 })
 */
export function insertSorted<Item>(
    params: InsertSortedParams<Item>,
): Item[] | undefined;
export function insertSorted(params: unknown): unknown[] | undefined;
export function insertSorted(params: unknown): unknown[] | undefined {
    const plan = readSearch<unknown>(params);
    if (plan === undefined) {
        return undefined;
    }
    const index = bisectLeft(plan);
    const result = copyArray(plan.array);
    result.splice(index, 0, plan.value);
    return result;
}

/**
 * Validates the search options, then the array.
 *
 * @param params - The caller argument.
 * @returns A search plan, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` or `numeric` has the wrong type.
 * @throws {@link RangeError} When `locale` is invalid.
 */
function readSearch<Item>(params: unknown): SearchPlan<Item> | undefined {
    const resolved = readParams<InsertSortedParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const search = searchComparison(
        sortDefaultsFrom(resolved),
        resolved.numeric === true,
    );
    const read = searchKeyReader(resolved.by as Iteratee<Item> | undefined);
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return {
        array,
        value: resolved.value,
        read,
        target: read(resolved.value),
        collator: search.collator,
        nulls: search.nulls,
        direction: search.direction,
    };
}

/**
 * Copies defined search options. Direction stays ascending.
 *
 * @param source - Call-level options.
 * @returns Options safe to validate.
 */
function sortDefaultsFrom(source: {
    locale?: string | readonly string[];
    numeric?: boolean;
}): SortDefaults {
    const defaults: SortDefaults = {};
    if (source.locale !== undefined) {
        defaults.locale = source.locale;
    }
    if (source.numeric !== undefined) {
        defaults.numeric = source.numeric;
    }
    return defaults;
}

/**
 * Lowest index at which the target can be inserted.
 *
 * @param plan - A validated search.
 * @returns An index from `0` through the array length.
 */
function bisectLeft<Item>(plan: SearchPlan<Item>): number {
    let low = 0;
    let high = plan.array.length;
    while (low < high) {
        const middle = Math.floor((low + high) / 2);
        const item = plan.array[middle] as Item;
        const comparison = compareSortKeys(
            plan.read(item),
            plan.target,
            plan.direction,
            plan.nulls,
            plan.collator,
        );
        if (comparison < 0) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }
    return low;
}
