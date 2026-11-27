import { readItem } from "../utils/array.utils.js";
import { readArray } from "../utils/params.utils.js";

/**
 * Returns every item except the first.
 *
 * An empty array and a one-item array both return a new empty array. A
 * non-array returns `undefined`. The result is a new dense array, so a
 * hole becomes `undefined`. The input is not mutated.
 *
 * @param array - The array to copy from. A non-array returns `undefined`.
 * @returns A new array of every item except the first, or `undefined` when `array` is not an array.
 * @example
 * getTail([1, 2, 3]);
 */
export function getTail<Item>(array: readonly Item[]): Item[] | undefined;
/**
 * @param array - A value that is not an array.
 * @returns `undefined` when `array` is not an array.
 */
export function getTail(
    array:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function getTail(array: unknown): unknown[] | undefined {
    const items = readArray(array);
    if (items === undefined) {
        return undefined;
    }
    if (items.length === 0) {
        return [];
    }
    return copyRange(items, 1, items.length);
}

/**
 * Copies items from `start` inclusive to `end` exclusive.
 *
 * A hole is copied as `undefined`.
 *
 * @param array - The source array. It is not mutated.
 * @param start - First index to copy.
 * @param end - Index at which to stop.
 * @returns A new array.
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
