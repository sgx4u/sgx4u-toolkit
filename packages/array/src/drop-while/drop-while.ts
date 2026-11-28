import type { DropWhileParams } from "./drop-while.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertPredicate } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Drops the leading run of items that satisfy `predicate`.
 *
 * The first item that does not satisfy `predicate` starts the result.
 * An empty array, and an array whose every item matches, return a new
 * empty array. The result is a new dense array. The input is not
 * mutated. When the argument is a params object, `predicate` is checked
 * before `array`. A non-object argument returns `undefined`. A non-array
 * `array` returns `undefined`.
 *
 * @param params - `array` and `predicate`.
 * @returns The items after the leading run, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `predicate` is not a function.
 * @example
 * dropWhile({ array: [1, 2, 0, 3], predicate: (item) => item > 0 });
 */
export function dropWhile<Item>(
    params: DropWhileParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function dropWhile(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function dropWhile(params: unknown): unknown[] | undefined {
    const parsed = readParams<DropWhileParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const predicate = assertPredicate("predicate", parsed.predicate);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    let start = 0;
    while (
        start < array.length &&
        predicate(readItem(array, start), start, array)
    ) {
        start += 1;
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
