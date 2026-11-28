import type { SliceArrayParams } from "./slice-array.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertFiniteNumber } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns a dense copy of an array slice.
 *
 * Indexes follow `Array#slice`: a negative index counts from the end and
 * is clamped, and a finite non-integer is truncated toward zero. Omitted
 * `start` is `0`. Omitted `end` is the array length. The slice is taken
 * from a dense copy, so a hole becomes `undefined`. The input is not
 * mutated. A non-array `array` returns `undefined`. A non-object argument
 * returns `undefined`. When `start` or `end` is present, it is checked
 * before `array`.
 *
 * @param params - `array`, and optional `start` and `end`.
 * @returns A new array of the slice, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `start` or `end` is present and is not a number.
 * @throws {@link RangeError} When `start` or `end` is `NaN` or an infinity.
 * @example
 * sliceArray({ array: [1, 2, 3, 4], start: 1, end: 3 });
 */
export function sliceArray<Item>(
    params: SliceArrayParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function sliceArray(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function sliceArray(params: unknown): unknown[] | undefined {
    const parsed = readParams<SliceArrayParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const start = readSliceBound("start", parsed.start);
    const end = readSliceBound("end", parsed.end);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    return copyArray(array).slice(start ?? 0, end ?? array.length);
}

/**
 * Reads an omitted or finite slice bound.
 *
 * `undefined` means the caller omitted the bound. A finite number is
 * truncated toward zero. A non-number throws a type error. `NaN` and
 * infinities throw a range error.
 *
 * @param name - Argument name used in the error.
 * @param value - The bound the caller passed.
 * @returns The truncated bound, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is present and is not a number.
 * @throws {@link RangeError} When `value` is not finite.
 */
function readSliceBound(name: string, value: unknown): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    return Math.trunc(assertFiniteNumber(name, value));
}
