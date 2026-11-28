import type { SampleItemsParams } from "./sample-items.types.js";
import { copyArray } from "../utils/array.utils.js";
import { rangeError } from "../utils/errors.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";
import { randomIndexBelow, resolveRandom } from "../utils/random.utils.js";

/**
 * Returns `count` distinct items in random order, without replacement.
 *
 * The draw is a partial Fisher–Yates shuffle: only the prefix of length
 * `count` is swapped, each position with a random later index, and that
 * prefix is returned. The input array is not mutated.
 *
 * `count` of `0` returns an empty array. A count greater than the array
 * length throws. A value that is not a params object, or whose `array` is
 * not an array, returns `undefined`.
 *
 * @param input - {@link SampleItemsParams}.
 * @returns A new array of `count` items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `count` is not a number, or when `random` is present and is not a function.
 * @throws {@link RangeError} When `count` is not a finite integer greater than or equal to 0, when `count` is greater than the array length, when `seed` is not finite, or when `random` returns a number outside `[0, 1)`.
 * @example
 * sampleItems({ array: [1, 2, 3, 4], count: 2, seed: 1 })
 */
export function sampleItems<Item>(
    params: SampleItemsParams<Item>,
): Item[] | undefined;
export function sampleItems(input: unknown): unknown[] | undefined;
export function sampleItems(input: unknown): unknown[] | undefined {
    const params = readParams<SampleItemsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const count = assertNonNegativeInteger("count", params.count);
    const random = randomFrom(params);
    if (count > array.length) {
        throw rangeError(
            "count",
            `less than or equal to the array length ${array.length}`,
            count,
        );
    }
    return samplePrefix(array, count, random);
}

/**
 * Partial Fisher–Yates. The returned prefix has length `count`.
 *
 * @param array - The source array. It is not mutated.
 * @param count - How many items to keep. It is within the array length.
 * @param random - A source of numbers in `[0, 1)`.
 * @returns A new array of `count` distinct items.
 */
function samplePrefix<Item>(
    array: readonly Item[],
    count: number,
    random: () => number,
): Item[] {
    const copy = copyArray(array);
    for (let index = 0; index < count; index += 1) {
        const swapIndex = index + randomIndexBelow(random, copy.length - index);
        const current = copy[index] as Item;
        copy[index] = copy[swapIndex] as Item;
        copy[swapIndex] = current;
    }
    return copy.slice(0, count);
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
