import type { GetIndexOfParams } from "./get-index-of.types.js";
import { readItem } from "../utils/array.utils.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the first index of `value`, searching forward.
 *
 * Comparison is SameValueZero unless `equals` is set: `NaN` matches
 * `NaN`, and `-0` matches `0`. A negative `fromIndex` counts from the end
 * and is clamped to `0`. A non-integer `fromIndex` returns `undefined`.
 * A missing value returns `undefined`, not `-1`. A hole is read as
 * `undefined`. The array is not mutated. A non-array `array`, or a
 * non-object argument, returns `undefined`.
 *
 * @param params - `array`, `value`, and optional `equals` and `fromIndex`.
 * @returns The first matching index at or after `fromIndex`, or `undefined` when there is no match.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * getIndexOf({ array: [1, 2, 1], value: 1 });
 */
export function getIndexOf<Item>(
    params: GetIndexOfParams<Item>,
): number | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` cannot be searched.
 */
export function getIndexOf(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function getIndexOf(params: unknown): number | undefined {
    const parsed = readParams<GetIndexOfParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const equals = resolveEquals(parsed.equals);
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const fromIndex = resolveForwardStart(parsed.fromIndex, array.length);
    if (fromIndex === undefined) {
        return undefined;
    }
    for (let index = fromIndex; index < array.length; index += 1) {
        if (equals(readItem(array, index), parsed.value)) {
            return index;
        }
    }
    return undefined;
}

/**
 * Resolves a forward search start.
 *
 * An omitted index starts at `0`. A negative index counts from the end
 * and is clamped to `0`. A non-integer returns `undefined`.
 *
 * @param fromIndex - The caller-supplied start.
 * @param length - The array length.
 * @returns The first index to test, or `undefined` when `fromIndex` is not an integer.
 */
function resolveForwardStart(
    fromIndex: unknown,
    length: number,
): number | undefined {
    if (fromIndex === undefined) {
        return 0;
    }
    if (typeof fromIndex !== "number" || !Number.isInteger(fromIndex)) {
        return undefined;
    }
    if (fromIndex < 0) {
        return Math.max(length + fromIndex, 0);
    }
    return fromIndex;
}
