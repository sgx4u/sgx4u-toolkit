import type { Predicate } from "../types/iteratee.types.js";
import type { PartitionByParams } from "./partition-by.types.js";
import { typeError } from "../utils/errors.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Places each item in the first matching predicate bucket.
 *
 * The result has one array per predicate, in that order, plus a final
 * remainder for items that matched none. An empty predicate list returns
 * one remainder bucket. Each bucket keeps the original order. The input is
 * not mutated.
 *
 * @param params - `array` and `predicates`.
 * @returns The buckets, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicates` is not an array, or any entry is not a function.
 * @example
 * partitionBy({ array: [1, 2, 3, 4], predicates: [(item) => item % 2 === 0] })
 */
export function partitionBy<Item>(
    params: PartitionByParams<Item>,
): Item[][] | undefined;
export function partitionBy(params: unknown): unknown[][] | undefined;
export function partitionBy(params: unknown): unknown[][] | undefined {
    const resolved = readParams<PartitionByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const predicates = readPredicates(resolved.predicates);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return placeItems(array, predicates);
}

/**
 * Checks that every predicate is a function.
 *
 * @param predicates - The candidate list.
 * @returns The same functions.
 * @throws {@link TypeError} When `predicates` is not an array, or any entry is not a function.
 */
function readPredicates<Item>(predicates: unknown): readonly Predicate<Item>[] {
    if (!Array.isArray(predicates)) {
        throw typeError("predicates", "an array of functions", predicates);
    }
    const checked: Predicate<Item>[] = [];
    for (let index = 0; index < predicates.length; index += 1) {
        checked.push(assertPredicate<Item>("predicates", predicates[index]));
    }
    return checked;
}

/**
 * Copies each item into the first matching bucket.
 *
 * @param array - The source array.
 * @param predicates - Predicates already checked.
 * @returns One bucket per predicate, then the remainder.
 */
function placeItems<Item>(
    array: readonly Item[],
    predicates: readonly Predicate<Item>[],
): Item[][] {
    const buckets: Item[][] = [];
    for (let index = 0; index < predicates.length; index += 1) {
        buckets.push([]);
    }
    const remainder: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        let placed = false;
        for (
            let predicateIndex = 0;
            predicateIndex < predicates.length;
            predicateIndex += 1
        ) {
            const predicate = predicates[predicateIndex] as Predicate<Item>;
            if (predicate(item, index, array)) {
                const bucket = buckets[predicateIndex] as Item[];
                bucket.push(item);
                placed = true;
                break;
            }
        }
        if (!placed) {
            remainder.push(item);
        }
    }
    buckets.push(remainder);
    return buckets;
}
