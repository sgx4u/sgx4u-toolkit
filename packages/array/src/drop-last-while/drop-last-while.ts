import type { DropLastWhileParams } from "./drop-last-while.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Drops the trailing run of items that satisfy `predicate`.
 *
 * The scan walks from the end, then copies the prefix that remains, in
 * its original order. `[1, 2, 3, 4]` while `item > 2` returns `[1, 2]`.
 * An empty array, and an array whose every item matches, return a new
 * empty array. The input is not mutated. When the argument is a params
 * object, `predicate` is checked before `array`. A non-object argument
 * returns `undefined`. A non-array `array` returns `undefined`.
 *
 * @param params - `array` and `predicate`.
 * @returns The items before the trailing run, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * dropLastWhile({ array: [1, 2, 3, 4], predicate: (item) => item > 2 });
 */
export function dropLastWhile<Item>(
    params: DropLastWhileParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function dropLastWhile(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function dropLastWhile(params: unknown): unknown[] | undefined {
    const parsed = readParams<DropLastWhileParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const predicate = assertPredicate("predicate", parsed.predicate);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    let end = array.length;
    while (end > 0 && predicate(readItem(array, end - 1), end - 1, array)) {
        end -= 1;
    }
    return copyRange(array, 0, end);
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
