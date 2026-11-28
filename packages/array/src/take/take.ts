import type { TakeParams } from "./take.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the first `count` items, or fewer when the array is shorter.
 *
 * `count` of `0` returns a new empty array. The result is a new dense
 * array, so a hole becomes `undefined`. The input is not mutated. A
 * non-array `array` returns `undefined`. A non-object argument returns
 * `undefined`. When the argument is a params object, `count` is checked
 * before `array`.
 *
 * @param params - `array` and `count`.
 * @returns A new array of the leading items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `count` is not a number.
 * @throws {@link RangeError} When `count` is negative, fractional, or not finite.
 * @example
 * take({ array: [1, 2, 3], count: 2 });
 */
export function take<Item>(params: TakeParams<Item>): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function take(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function take(params: unknown): unknown[] | undefined {
    const parsed = readParams<TakeParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const count = assertNonNegativeInteger("count", parsed.count);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    return copyRange(array, 0, Math.min(count, array.length));
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
