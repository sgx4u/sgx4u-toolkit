import type { Direction } from "../types/sort.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import type { SortDefaults } from "../utils/sort.utils.js";
import type { MergeSortedParams } from "./merge-sorted.types.js";
import { readArray, readParams } from "../utils/params.utils.js";
import {
    compareSortKeys,
    searchComparison,
    searchKeyReader,
} from "../utils/sort.utils.js";

/**
 * Merges two sorted arrays into a new sorted array.
 *
 * Both inputs are assumed sorted ascending, with nullish keys and `NaN`
 * last. When the keys compare equal, the item from `first` is taken, so
 * ties keep `first` ahead of `second`. Either side not being an array
 * returns `undefined`. The inputs are not mutated. A function `by` is
 * called with the item, index `0`, and a one-element array.
 *
 * @param params - `first`, `second`, and optional `by`, `locale`, and `numeric`.
 * @returns The merged array, or `undefined` when either side is not an array.
 * @throws {@link TypeError} When `by` is not an iteratee, `numeric` is not a boolean, or `locale` has the wrong type.
 * @throws {@link RangeError} When `locale` is not a valid BCP 47 tag.
 * @example
 * mergeSorted({ first: [1, 3], second: [2, 3, 4] })
 */
export function mergeSorted<Item>(
    params: MergeSortedParams<Item>,
): Item[] | undefined;
export function mergeSorted(params: unknown): unknown[] | undefined;
export function mergeSorted(params: unknown): unknown[] | undefined {
    const resolved = readParams<MergeSortedParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const search = searchComparison(
        sortDefaultsFrom(resolved),
        resolved.numeric === true,
    );
    const read = searchKeyReader(resolved.by as Iteratee<unknown> | undefined);
    const first = readArray<unknown>(resolved.first);
    const second = readArray<unknown>(resolved.second);
    if (first === undefined || second === undefined) {
        return undefined;
    }
    return merge(
        first,
        second,
        read,
        search.collator,
        search.nulls,
        search.direction,
    );
}

/**
 * Copies defined search options. Direction stays ascending.
 *
 * @param source - Call-level options.
 * @returns Options safe to validate.
 */
function sortDefaultsFrom(source: MergeSortedParams<unknown>): SortDefaults {
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
 * Merges two sorted arrays. A tie takes from `first`.
 *
 * @param first - The first sorted array.
 * @param second - The second sorted array.
 * @param read - Key reader.
 * @param collator - Collator for text keys.
 * @param nulls - Where unordered keys go.
 * @param direction - Always `"ascending"` for this merge.
 * @returns A new array.
 */
function merge<Item>(
    first: readonly Item[],
    second: readonly Item[],
    read: (item: Item) => unknown,
    collator: Intl.Collator,
    nulls: "first" | "last",
    direction: Direction,
): Item[] {
    const result: Item[] = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < first.length && rightIndex < second.length) {
        const left = first[leftIndex] as Item;
        const right = second[rightIndex] as Item;
        const comparison = compareSortKeys(
            read(left),
            read(right),
            direction,
            nulls,
            collator,
        );
        if (comparison <= 0) {
            result.push(left);
            leftIndex += 1;
        } else {
            result.push(right);
            rightIndex += 1;
        }
    }
    for (let index = leftIndex; index < first.length; index += 1) {
        result.push(first[index] as Item);
    }
    for (let index = rightIndex; index < second.length; index += 1) {
        result.push(second[index] as Item);
    }
    return result;
}
