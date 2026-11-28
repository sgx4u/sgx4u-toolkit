import type { GetMeanParams } from "./get-mean.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the arithmetic mean of the numbers in the array.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetMeanParams}.
 * @returns The mean, or `undefined` when there is nothing to average.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when an item or `by` result is not a finite number.
 * @example
 * getMean({ array: [1, 2, 3] })
 */
export function getMean<Item>(params: GetMeanParams<Item>): number | undefined;
export function getMean(input: unknown): number | undefined;
export function getMean(input: unknown): number | undefined {
    const params = readParams<GetMeanParams<unknown>>(input);
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
    const samples = readFiniteNumbers(array, params.by);
    if (samples.length === 0) {
        return undefined;
    }
    let total = 0;
    for (const sample of samples) {
        total += sample.value;
    }
    return total / samples.length;
}
