import type { GetVarianceParams } from "./get-variance.types.js";
import { typeError } from "../utils/errors.utils.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the variance of the numbers in the array.
 *
 * The default is the population variance, the mean of the squared distances
 * from the mean, divided by `n`. One item then returns `0`. `sample: true`
 * divides by `n - 1` and returns `undefined` when fewer than two items are
 * present.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetVarianceParams}.
 * @returns The variance, or `undefined` when it cannot be computed.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, when `sample` is not a boolean, or when an item or `by` result is not a finite number.
 * @example
 * getVariance({ array: [1, 2, 3] })
 * @example
 * getVariance({ array: [1, 2, 3], sample: true })
 */
export function getVariance<Item>(
    params: GetVarianceParams<Item>,
): number | undefined;
export function getVariance(input: unknown): number | undefined;
export function getVariance(input: unknown): number | undefined {
    const params = readParams<GetVarianceParams<unknown>>(input);
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
    if (params.sample !== undefined && typeof params.sample !== "boolean") {
        throw typeError("sample", "a boolean", params.sample);
    }
    const sample = params.sample === true;
    const values = readFiniteNumbers(array, params.by).map(
        (entry) => entry.value,
    );
    return varianceOf(values, sample);
}

/**
 * @param values - Finite numbers.
 * @param sample - When true, divide by `n - 1`.
 * @returns The variance, or `undefined` when the divisor is not available.
 */
function varianceOf(
    values: readonly number[],
    sample: boolean,
): number | undefined {
    const count = values.length;
    if (count === 0) {
        return undefined;
    }
    if (sample && count < 2) {
        return undefined;
    }
    let total = 0;
    for (const value of values) {
        total += value;
    }
    const mean = total / count;
    let squareTotal = 0;
    for (const value of values) {
        const distance = value - mean;
        squareTotal += distance * distance;
    }
    const divisor = sample ? count - 1 : count;
    return squareTotal / divisor;
}
