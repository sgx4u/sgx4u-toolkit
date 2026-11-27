import type { GetRunningTotalsParams } from "./get-running-totals.types.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the inclusive prefix sums of the numbers in the array.
 *
 * An empty array returns `undefined`, not an empty array. A value that is
 * not a params object, or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetRunningTotalsParams}.
 * @returns A new array of prefix sums, or `undefined` when there is nothing to add.
 * @throws {@link TypeError} When `by` is set and is not an iteratee, or when an item or `by` result is not a finite number.
 * @example
 * getRunningTotals({ array: [1, 2, 3] })
 */
export function getRunningTotals<Item>(
    params: GetRunningTotalsParams<Item>,
): number[] | undefined;
export function getRunningTotals(input: unknown): number[] | undefined;
export function getRunningTotals(input: unknown): number[] | undefined {
    const params = readParams<GetRunningTotalsParams<unknown>>(input);
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
    const totals: number[] = [];
    let total = 0;
    for (const sample of samples) {
        total += sample.value;
        totals.push(total);
    }
    return totals;
}
