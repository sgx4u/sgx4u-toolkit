import type { Predicate } from "../types/iteratee.types.js";
import type { PartitionParams } from "./partition.types.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Splits an array into items that match a predicate and items that do not.
 *
 * Both buckets keep the original order. The input is not mutated. The
 * predicate receives the item, its index, and the source array. A hole is
 * passed as `undefined`.
 *
 * @param params - `array` and a `predicate` function.
 * @returns `[matches, rest]`, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * partition({ array: [1, 2, 3, 4], predicate: (item) => item % 2 === 0 })
 */
export function partition<Item>(
    params: PartitionParams<Item>,
): [Item[], Item[]] | undefined;
export function partition(params: unknown): [unknown[], unknown[]] | undefined;
export function partition(params: unknown): [unknown[], unknown[]] | undefined {
    const resolved = readParams<PartitionParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const predicate = assertPredicate<unknown>("predicate", resolved.predicate);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return splitByPredicate(array, predicate);
}

/**
 * Copies matches and the rest into two new arrays.
 *
 * @param array - The source array.
 * @param predicate - The caller's predicate.
 * @returns `[matches, rest]` in original order.
 */
function splitByPredicate<Item>(
    array: readonly Item[],
    predicate: Predicate<Item>,
): [Item[], Item[]] {
    const matches: Item[] = [];
    const rest: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        if (predicate(item, index, array)) {
            matches.push(item);
            continue;
        }
        rest.push(item);
    }
    return [matches, rest];
}
