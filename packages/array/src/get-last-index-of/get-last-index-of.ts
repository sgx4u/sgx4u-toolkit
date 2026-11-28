import type { GetLastIndexOfParams } from "./get-last-index-of.types.js";
import { readItem } from "../utils/array.utils.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the last index of `value`, searching backward.
 *
 * Comparison is SameValueZero unless `equals` is set: `NaN` matches
 * `NaN`, and `-0` matches `0`. `fromIndex` defaults to the last index. A
 * negative index counts from the end. An index past the end starts at the
 * last index. An index that falls before the start, or a non-integer,
 * returns `undefined`. A missing value returns `undefined`, not `-1`. A
 * hole is read as `undefined`. The array is not mutated. A non-array
 * `array`, or a non-object argument, returns `undefined`.
 *
 * @param params - `array`, `value`, and optional `equals` and `fromIndex`.
 * @returns The last matching index at or before `fromIndex`, or `undefined` when there is no match.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * getLastIndexOf({ array: [1, 2, 1], value: 1 });
 */
export function getLastIndexOf<Item>(
    params: GetLastIndexOfParams<Item>,
): number | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` cannot be searched.
 */
export function getLastIndexOf(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function getLastIndexOf(params: unknown): number | undefined {
    const parsed = readParams<GetLastIndexOfParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const equals = resolveEquals(parsed.equals);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const fromIndex = resolveBackwardStart(parsed.fromIndex, array.length);
    if (fromIndex === undefined) {
        return undefined;
    }
    for (let index = fromIndex; index >= 0; index -= 1) {
        if (equals(readItem(array, index), parsed.value)) {
            return index;
        }
    }
    return undefined;
}

/**
 * Resolves a backward search start.
 *
 * An omitted index starts at the last index. A negative index counts
 * from the end. An index past the end starts at the last index. A start
 * before `0`, or a non-integer, returns `undefined`.
 *
 * @param fromIndex - The caller-supplied start.
 * @param length - The array length.
 * @returns The first index to test, or `undefined` when the search cannot start.
 */
function resolveBackwardStart(
    fromIndex: unknown,
    length: number,
): number | undefined {
    if (fromIndex === undefined) {
        return length === 0 ? undefined : length - 1;
    }
    if (typeof fromIndex !== "number" || !Number.isInteger(fromIndex)) {
        return undefined;
    }
    let start = fromIndex;
    if (start >= length) {
        start = length - 1;
    } else if (start < 0) {
        start = length + start;
    }
    if (start < 0) {
        return undefined;
    }
    return start;
}
