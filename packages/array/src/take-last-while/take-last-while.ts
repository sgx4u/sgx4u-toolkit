import type { TakeLastWhileParams } from "./take-last-while.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the trailing run of items that satisfy `predicate`.
 *
 * The scan walks from the end to find where the run starts, then copies
 * that suffix in its original order. `[1, 2, 3, 4]` while `item > 2`
 * returns `[3, 4]`. An empty array, and an array whose last item fails,
 * return a new empty array. The input is not mutated. When the argument
 * is a params object, `predicate` is checked before `array`. A non-object
 * argument returns `undefined`. A non-array `array` returns `undefined`.
 *
 * @param params - `array` and `predicate`.
 * @returns The trailing run, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * takeLastWhile({ array: [1, 2, 3, 4], predicate: (item) => item > 2 });
 */
export function takeLastWhile<Item>(
    params: TakeLastWhileParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function takeLastWhile(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function takeLastWhile(params: unknown): unknown[] | undefined {
    const parsed = readParams<TakeLastWhileParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const predicate = assertPredicate("predicate", parsed.predicate);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    let start = array.length;
    while (start > 0) {
        const index = start - 1;
        if (!predicate(readItem(array, index), index, array)) {
            break;
        }
        start = index;
    }
    return copyRange(array, start, array.length);
}

/**
 * Copies items from `start` inclusive to `end` exclusive.
 *
 * @param array - The source array. It is not mutated.
 * @param start - First index to copy.
 * @param end - Index at which to stop.
 * @returns A new dense array.
 */
function copyRange(
    array: readonly unknown[],
    start: number,
    end: number,
): unknown[] {
    const result: unknown[] = [];
    for (let index = start; index < end; index += 1) {
        result.push(readItem(array, index));
    }
    return result;
}
