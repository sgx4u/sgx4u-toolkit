import type {
    GetPercentileParams,
    PercentileMethod,
} from "./get-percentile.types.js";
import { assertChoice, rangeError } from "../utils/errors.utils.js";
import { assertIteratee } from "../utils/iteratee.utils.js";
import { assertFiniteNumber } from "../utils/number.utils.js";
import { readFiniteNumbers } from "../utils/numbers.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/** Methods `getPercentile` accepts. */
const percentileMethods = ["linear", "nearest"] as const;

/**
 * Returns a percentile of the numbers in the array.
 *
 * The numbers are sorted on a copy. The rank is
 * `(percentile / 100) * (length - 1)`. `"linear"` interpolates between the
 * floor and ceiling. `"nearest"` uses `Math.round`. One item returns that
 * number for every percentile.
 *
 * An empty array returns `undefined`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetPercentileParams}.
 * @returns The percentile, or `undefined` when there is nothing to rank.
 * @throws {@link TypeError} When `percentile` is not a number, when `by` is set and is not an iteratee, or when an item or `by` result is not a finite number.
 * @throws {@link RangeError} When `percentile` is not finite or is outside 0 through 100, or when `method` is not `"linear"` or `"nearest"`.
 * @example
 * getPercentile({ array: [1, 2, 3, 4], percentile: 50 })
 */
export function getPercentile<Item>(
    params: GetPercentileParams<Item>,
): number | undefined;
export function getPercentile(input: unknown): number | undefined;
export function getPercentile(input: unknown): number | undefined {
    const params = readParams<GetPercentileParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const percentile = assertFiniteNumber("percentile", params.percentile);
    if (percentile < 0 || percentile > 100) {
        throw rangeError(
            "percentile",
            "a finite number from 0 through 100",
            percentile,
        );
    }
    assertChoice("method", params.method, percentileMethods);
    if (params.by !== undefined) {
        assertIteratee("by", params.by);
    }
    const samples = readFiniteNumbers(array, params.by);
    if (samples.length === 0) {
        return undefined;
    }
    const sorted = samples
        .map((sample) => sample.value)
        .sort((left, right) => left - right);
    const method: PercentileMethod = params.method ?? "linear";
    return percentileAt(sorted, percentile, method);
}

/**
 * @param sorted - Numbers in ascending order. At least one.
 * @param percentile - A finite number from 0 through 100.
 * @param method - `"linear"` or `"nearest"`.
 * @returns The percentile.
 */
function percentileAt(
    sorted: readonly number[],
    percentile: number,
    method: PercentileMethod,
): number {
    const rank = (percentile / 100) * (sorted.length - 1);
    if (method === "nearest") {
        return sorted[Math.round(rank)] as number;
    }
    const lowerIndex = Math.floor(rank);
    const upperIndex = Math.ceil(rank);
    const lower = sorted[lowerIndex] as number;
    const upper = sorted[upperIndex] as number;
    if (lowerIndex === upperIndex) {
        return lower;
    }
    const fraction = rank - lowerIndex;
    return lower * (1 - fraction) + upper * fraction;
}
