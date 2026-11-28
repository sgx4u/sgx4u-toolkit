import type { GetStandardDeviationParams } from "./get-standard-deviation.types.js";
import { getVariance } from "../get-variance/get-variance.js";

/**
 * Returns the standard deviation of the numbers in the array.
 *
 * This is the square root of {@link getVariance} with the same `sample`
 * rule. When the variance is `undefined`, the result is `undefined`.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetStandardDeviationParams}.
 * @returns The standard deviation, or `undefined` when it cannot be computed.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, when `sample` is not a boolean, or when an item or `by` result is not a finite number.
 * @example
 * getStandardDeviation({ array: [1, 2, 3] })
 */
export function getStandardDeviation<Item>(
    params: GetStandardDeviationParams<Item>,
): number | undefined;
export function getStandardDeviation(input: unknown): number | undefined;
export function getStandardDeviation(input: unknown): number | undefined {
    const variance = getVariance(input);
    if (variance === undefined) {
        return undefined;
    }
    return Math.sqrt(variance);
}
