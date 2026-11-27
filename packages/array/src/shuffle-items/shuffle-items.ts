import type { ShuffleItemsParams } from "./shuffle-items.types.js";
import { copyArray } from "../utils/array.utils.js";
import { readArray, readArrayParams } from "../utils/params.utils.js";
import { randomIndexBelow, resolveRandom } from "../utils/random.utils.js";

/**
 * Returns a new array with the same items in a random order.
 *
 * The shuffle is Fisher–Yates on a copy. The input array is not mutated.
 * An empty array returns an empty array. A value that is not an array, and
 * a params object whose `array` is not an array, returns `undefined`.
 *
 * Pass a bare array, or `{ array, random, seed }`. A finite `seed` selects
 * the deterministic generator and ignores `random`.
 *
 * @param input - A bare array, or {@link ShuffleItemsParams}.
 * @returns A new permutation, or `undefined` when `array` is not an array.
 * @throws {@link RangeError} When `seed` is not finite, or when `random` returns a number outside `[0, 1)`.
 * @throws {@link TypeError} When `random` is present and is not a function.
 * @example
 * shuffleItems([1, 2, 3])
 * @example
 * shuffleItems({ array: [1, 2, 3], seed: 1 })
 */
export function shuffleItems<Item>(array: readonly Item[]): Item[];
export function shuffleItems<Item>(params: ShuffleItemsParams<Item>): Item[];
export function shuffleItems(input: unknown): unknown[] | undefined;
export function shuffleItems(input: unknown): unknown[] | undefined {
    const params = readArrayParams<ShuffleItemsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    return shuffleCopy(array, randomFrom(params));
}

/**
 * Fisher–Yates shuffle of a dense copy.
 *
 * @param array - The source array. It is not mutated.
 * @param random - A source of numbers in `[0, 1)`.
 * @returns A new permutation. An empty source returns an empty array.
 */
function shuffleCopy<Item>(
    array: readonly Item[],
    random: () => number,
): Item[] {
    const result = copyArray(array);
    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndexBelow(random, index + 1);
        const current = result[index] as Item;
        result[index] = result[swapIndex] as Item;
        result[swapIndex] = current;
    }
    return result;
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
