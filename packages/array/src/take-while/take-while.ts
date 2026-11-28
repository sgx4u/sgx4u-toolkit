import type { TakeWhileParams } from "./take-while.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the leading run of items that satisfy `predicate`.
 *
 * The copy stops before the first item that does not satisfy
 * `predicate`. An empty array, and an array whose first item fails,
 * return a new empty array. The result is a new dense array. The input
 * is not mutated. When the argument is a params object, `predicate` is
 * checked before `array`. A non-object argument returns `undefined`. A
 * non-array `array` returns `undefined`.
 *
 * @param params - `array` and `predicate`.
 * @returns The leading run, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * takeWhile({ array: [1, 2, 0, 3], predicate: (item) => item > 0 });
 */
export function takeWhile<Item>(
    params: TakeWhileParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function takeWhile(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function takeWhile(params: unknown): unknown[] | undefined {
    const parsed = readParams<TakeWhileParams<unknown>>(params);
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
            break;
        }
        result.push(item);
    }
    return result;
}
