import type { GetMedianParams } from "./get-median.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the median of the numbers in the array.
 *
 * The numbers are sorted on a copy. An odd count returns the middle number.
 * An even count returns the mean of the two central numbers. An empty array
 * returns `undefined`. A value that is not a params object, or whose `array`
 * is not an array, returns `undefined`.
 *
 * @param input - {@link GetMedianParams}.
 * @returns The median, or `undefined` when there is nothing to rank.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when an item or `by` result is not a finite number.
 * @example
 * getMedian({ array: [3, 1, 2] })
 */
export function getMedian<Item>(
    params: GetMedianParams<Item>,
): number | undefined;
export function getMedian(input: unknown): number | undefined;
export function getMedian(input: unknown): number | undefined {
    const values = finiteValues(input);
    if (values === undefined || values.length === 0) {
        return undefined;
    }
    const sorted = values.slice().sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 1) {
        return sorted[middle] as number;
    }
    const lower = sorted[middle - 1] as number;
    const upper = sorted[middle] as number;
    return (lower + upper) / 2;
}

/**
 * @param input - The caller argument.
 * @returns The finite numbers, an empty array, or `undefined` when `array` is not an array.
 */
function finiteValues(input: unknown): number[] | undefined {
    const params = readParams<GetMedianParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    if (params.by !== undefined) {
        assertIteratee("by", params.by);
    }
    return readFiniteNumbers(array, params.by).map((sample) => sample.value);
}
