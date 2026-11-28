import type { DropLastParams } from "./drop-last.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the items before the last `count` items.
 *
 * Skipping more items than the array holds returns a new empty array.
 * `count` of `0` returns a copy of every item. The result is a new dense
 * array, so a hole becomes `undefined`. The input is not mutated. A
 * non-array `array` returns `undefined`. A non-object argument returns
 * `undefined`. When the argument is a params object, `count` is checked
 * before `array`.
 *
 * @param params - `array` and `count`.
 * @returns A new array of the remaining items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `count` is not a number.
 * @throws {@link RangeError} When `count` is negative, fractional, or not finite.
 * @example
 * dropLast({ array: [1, 2, 3], count: 1 });
 */
export function dropLast<Item>(
    params: DropLastParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function dropLast(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function dropLast(params: unknown): unknown[] | undefined {
    const parsed = readParams<DropLastParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const count = assertNonNegativeInteger("count", parsed.count);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    return copyRange(array, 0, Math.max(0, array.length - count));
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
