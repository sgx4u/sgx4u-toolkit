import type { SampleWeightedParams } from "./sample-weighted.types.js";
import type { Iteratee } from "../types/iteratee.types.js";
import {
    describeReceived,
    rangeError,
    typeError,
} from "../utils/errors.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import { resolveRandom } from "../utils/random.utils.js";

/**
 * Draws items with probability proportional to their weight.
 *
 * Each weight must be a finite number greater than or equal to 0. An item
 * whose weight is 0 is never drawn. When every weight is 0, including an
 * empty array, the result is `undefined` unless `count` is 0, which returns
 * an empty array.
 *
 * Without replacement, a drawn item's weight becomes 0 so it cannot be
 * drawn again. `count` may not exceed the number of items with a positive
 * weight. With replacement, weights stay and the same item can repeat.
 *
 * The input array is not mutated. A value that is not a params object, or
 * whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link SampleWeightedParams}.
 * @returns A new array of `count` items, or `undefined` when there is no positive weight or `array` is not an array.
 * @throws {@link TypeError} When `weight` is not a property key or a function, when `count` is not a number, when `replacement` is not a boolean, or when `random` is present and is not a function.
 * @throws {@link RangeError} When a weight is not a finite number greater than or equal to 0, when `count` is not a finite integer greater than or equal to 0, when `count` exceeds the number of positively weighted items and `replacement` is false, when `seed` is not finite, or when `random` returns a number outside `[0, 1)`.
 * @example
 * sampleWeighted({
 *   array: ["a", "b"],
 *   weight: (item) => (item === "a" ? 1 : 3),
 *   seed: 1,
 * })
 */
export function sampleWeighted<Item>(
    params: SampleWeightedParams<Item>,
): Item[] | undefined;
export function sampleWeighted(input: unknown): unknown[] | undefined;
export function sampleWeighted(input: unknown): unknown[] | undefined {
    const params = readParams<SampleWeightedParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    assertIteratee("weight", params.weight);
    const count =
        params.count === undefined
            ? 1
            : assertNonNegativeInteger("count", params.count);
    if (
        params.replacement !== undefined &&
        typeof params.replacement !== "boolean"
    ) {
        throw typeError("replacement", "a boolean", params.replacement);
    }
    const replacement = params.replacement === true;
    const random = randomFrom(params);
    const weights = readWeights(array, params.weight);
    if (count === 0) {
        return [];
    }
    const positiveCount = countPositive(weights);
    if (positiveCount === 0) {
        return undefined;
    }
    if (!replacement && count > positiveCount) {
        throw rangeError(
            "count",
            `less than or equal to the number of items with a positive weight (${positiveCount})`,
            count,
        );
    }
    return drawWeighted(array, weights, count, replacement, random);
}

/**
 * @param array - The source array.
 * @param weight - A property key or a function. Already checked.
 * @returns One finite weight per item.
 * @throws {@link RangeError} When a weight is not finite or is negative.
 */
function readWeights<Item>(
    array: readonly Item[],
    weight: Iteratee<Item, number>,
): number[] {
    const read = resolveIteratee(weight);
    const weights: number[] = [];
    for (let index = 0; index < array.length; index += 1) {
        const value = read(array[index] as Item, index, array);
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
            throw new RangeError(
                `\`weight\` must return a finite number greater than or equal to 0; received ${describeReceived(value)}.`,
            );
        }
        weights.push(value);
    }
    return weights;
}

/**
 * @param weights - Finite weights greater than or equal to 0.
 * @returns How many weights are greater than 0.
 */
function countPositive(weights: readonly number[]): number {
    let positiveCount = 0;
    for (const weight of weights) {
        if (weight > 0) {
            positiveCount += 1;
        }
    }
    return positiveCount;
}

/**
 * @param array - The source items.
 * @param weights - Mutable copy of the weights. Without replacement, a draw writes 0.
 * @param count - How many draws to make.
 * @param replacement - When true, weights are left unchanged.
 * @param random - A source of numbers in `[0, 1)`.
 * @returns The drawn items, in draw order.
 */
function drawWeighted<Item>(
    array: readonly Item[],
    weights: number[],
    count: number,
    replacement: boolean,
    random: () => number,
): Item[] {
    const result: Item[] = [];
    for (let draw = 0; draw < count; draw += 1) {
        const index = pickWeightedIndex(weights, random);
        result.push(array[index] as Item);
        if (!replacement) {
            weights[index] = 0;
        }
    }
    return result;
}

/**
 * Picks an index with probability proportional to its current weight.
 *
 * @param weights - Finite weights. At least one is greater than 0.
 * @param random - A source of numbers in `[0, 1)`.
 * @returns An index whose weight is greater than 0.
 */
function pickWeightedIndex(
    weights: readonly number[],
    random: () => number,
): number {
    let total = 0;
    for (const weight of weights) {
        total += weight;
    }
    const target = random() * total;
    let cumulative = 0;
    let lastPositive = 0;
    for (let index = 0; index < weights.length; index += 1) {
        const weight = weights[index] as number;
        if (weight <= 0) {
            continue;
        }
        lastPositive = index;
        cumulative += weight;
        if (cumulative > target) {
            return index;
        }
    }
    return lastPositive;
}

/**
 * @param params - The caller's random source and seed.
 * @returns A function that returns numbers in `[0, 1)`.
 */
function randomFrom(params: {
    random?: unknown;
    seed?: unknown;
}): () => number {
    const options: { random?: unknown; seed?: unknown } = {};
    if (params.random !== undefined) {
        options.random = params.random;
    }
    if (params.seed !== undefined) {
        options.seed = params.seed;
    }
    return resolveRandom(options);
}
