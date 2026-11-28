import type { SplitAtParams } from "./split-at.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertFiniteNumber } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Splits an array into the items before `index` and the items from
 * `index` onward.
 *
 * A negative index counts from the end. The index is clamped into
 * `0..length`, including an index past either end. A finite non-integer
 * is truncated toward zero before that clamp. An index equal to the
 * length returns the dense copy and a new empty array. Both sides are
 * new arrays. Holes become `undefined`. The input is not mutated. A
 * non-array `array` returns `undefined`. A non-object argument returns
 * `undefined`. `index` is checked before `array`.
 *
 * @param params - `array` and `index`.
 * @returns A pair of new arrays, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `index` is not a number.
 * @throws {@link RangeError} When `index` is `NaN` or an infinity.
 * @example
 * splitAt({ array: [1, 2, 3, 4], index: 2 });
 */
export function splitAt<Item>(
    params: SplitAtParams<Item>,
): [Item[], Item[]] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function splitAt(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function splitAt(params: unknown): [unknown[], unknown[]] | undefined {
    const parsed = readParams<SplitAtParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const index = Math.trunc(assertFiniteNumber("index", parsed.index));
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const splitIndex = clampSplitIndex(index, array.length);
    const copy = copyArray(array);
    return [copy.slice(0, splitIndex), copy.slice(splitIndex)];
}

/**
 * Clamps a truncated split index into `0..length`.
 *
 * A negative index counts from the end before the clamp.
 *
 * @param index - A finite integer, already truncated toward zero.
 * @param length - The array length.
 * @returns An index from `0` through `length`.
 */
function clampSplitIndex(index: number, length: number): number {
    const resolved = index < 0 ? length + index : index;
    if (resolved < 0) {
        return 0;
    }
    if (resolved > length) {
        return length;
    }
    return resolved;
}
