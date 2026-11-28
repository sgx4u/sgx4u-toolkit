import type { RepeatArrayParams } from "./repeat-array.types.js";
import { readItem } from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Concatenates `count` shallow copies of an array.
 *
 * `count` is checked when the argument is a params object, before `array`
 * is read. A non-array `array` returns `undefined`. A non-object argument
 * returns `undefined`. `count` of `0` returns `[]`. `count` of `1` returns
 * a shallow copy, not the same array. The input is not mutated.
 *
 * @param params - The array and the count.
 * @returns The repeated items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `count` is not a number.
 * @throws {@link RangeError} When `count` is negative, fractional, or not finite.
 * @example
 * repeatArray({ array: [1, 2], count: 3 });
 */
export function repeatArray<Item>(
    params: RepeatArrayParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function repeatArray(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function repeatArray(params: unknown): unknown[] | undefined {
    const resolved = readParams<RepeatArrayParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const count = assertNonNegativeInteger("count", resolved.count);
    const array = readArray(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return repeatCopies(array, count);
}

/**
 * @param array - The source array.
 * @param count - How many shallow copies to concatenate.
 * @returns A new dense array.
 */
function repeatCopies(array: readonly unknown[], count: number): unknown[] {
    const result: unknown[] = [];
    for (let copy = 0; copy < count; copy += 1) {
        for (let index = 0; index < array.length; index += 1) {
            result.push(readItem(array, index));
        }
    }
    return result;
}
