import type { FillRangeParams } from "./fill-range.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertFiniteNumber } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Fills a range of a copy, using the index rules of `Array#fill`.
 *
 * Omitted `start` begins at `0`. Omitted `end` stops at the length.
 * Negative indexes count from the end and are clamped the way `fill`
 * clamps them. A present `start` or `end` that is not a finite number
 * throws before the source array is read. The input is not mutated.
 *
 * @param params - The source array, the fill value, and the optional range.
 * @returns The filled array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When a present bound is not a number.
 * @throws {@link RangeError} When a present bound is `NaN` or an infinity.
 * @example
 * fillRange({ array: [1, 2, 3, 4], value: 0, start: 1, end: 3 });
 */
export function fillRange<Item>(
    params: FillRangeParams<Item>,
): Item[] | undefined {
    const resolved = readParams<FillRangeParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const start = readBound("start", resolved.start);
    const end = readBound("end", resolved.end);
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return fillCopy(array, resolved.value, start, end);
}

/**
 * Checks a bound only when the caller provided one.
 *
 * @param name - `start` or `end`.
 * @param bound - The candidate bound. Omitted stays omitted.
 * @returns The finite bound, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `bound` is not a number.
 * @throws {@link RangeError} When `bound` is not finite.
 */
function readBound(name: string, bound: unknown): number | undefined {
    if (bound === undefined) {
        return undefined;
    }
    return assertFiniteNumber(name, bound);
}

/**
 * Fills a dense copy. Native `fill` applies the index rules.
 *
 * @param array - The source array.
 * @param value - The fill value.
 * @param start - A finite start, or omitted.
 * @param end - A finite end, or omitted.
 * @returns The filled copy.
 */
function fillCopy<Item>(
    array: readonly Item[],
    value: Item,
    start: number | undefined,
    end: number | undefined,
): Item[] {
    const copy = copyArray(array);
    if (start !== undefined && end !== undefined) {
        copy.fill(value, start, end);
        return copy;
    }
    if (start !== undefined) {
        copy.fill(value, start);
        return copy;
    }
    if (end !== undefined) {
        copy.fill(value, 0, end);
        return copy;
    }
    copy.fill(value);
    return copy;
}
