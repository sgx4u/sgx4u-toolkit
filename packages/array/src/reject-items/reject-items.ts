import type { RejectItemsParams } from "./reject-items.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the items for which `predicate` is false.
 *
 * This is the complement of a filter: an item is kept when `predicate`
 * returns a falsy result. An empty array, and an array whose every item
 * matches, return a new empty array. The result is a new dense array.
 * The input is not mutated. When the argument is a params object,
 * `predicate` is checked before `array`. A non-object argument returns
 * `undefined`. A non-array `array` returns `undefined`.
 *
 * @param params - `array` and `predicate`.
 * @returns The rejected complement, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * rejectItems({ array: [1, 2, 3, 4], predicate: (item) => item % 2 === 0 });
 */
export function rejectItems<Item>(
    params: RejectItemsParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function rejectItems(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function rejectItems(params: unknown): unknown[] | undefined {
    const parsed = readParams<RejectItemsParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const predicate = assertPredicate("predicate", parsed.predicate);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const result: unknown[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const item = readItem(array, index);
        if (!predicate(item, index, array)) {
            result.push(item);
        }
    }
    return result;
}
