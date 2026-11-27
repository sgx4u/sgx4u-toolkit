import type { GetSumParams } from "./get-sum.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the sum of the numbers in the array.
 *
 * An empty array returns `0`. A value that is not a params object, or whose
 * `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetSumParams}.
 * @returns The sum, `0` for an empty array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when an item or `by` result is not a finite number.
 * @example
 * getSum({ array: [1, 2, 3] })
 */
export function getSum<Item>(params: GetSumParams<Item>): number | undefined;
export function getSum(input: unknown): number | undefined;
export function getSum(input: unknown): number | undefined {
    const params = readNumericParams<GetSumParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const samples = readFiniteNumbers(params.array, params.by);
    let total = 0;
    for (const sample of samples) {
        total += sample.value;
    }
    return total;
}

/**
 * @param input - The caller argument.
 * @returns Params with an array, or `undefined`.
 */
function readNumericParams<
    Params extends { array: readonly unknown[]; by?: unknown },
>(input: unknown): (Params & { array: readonly unknown[] }) | undefined {
    const params = readParams<Params>(input);
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
    return params;
}
