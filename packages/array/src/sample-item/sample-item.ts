import type { SampleItemParams } from "./sample-item.types.js";
import { readArray, readArrayParams } from "../utils/params.utils.js";
import { randomIndexBelow, resolveRandom } from "../utils/random.utils.js";

/**
 * Returns one item chosen uniformly from the array.
 *
 * An empty array returns `undefined`. A value that is not an array, and a
 * params object whose `array` is not an array, also returns `undefined`.
 * The input array is not mutated.
 *
 * Pass a bare array, or `{ array, random, seed }`. A finite `seed` selects
 * the deterministic generator and ignores `random`.
 *
 * @param input - A bare array, or {@link SampleItemParams}.
 * @returns The chosen item, or `undefined` when there is nothing to draw.
 * @throws {@link RangeError} When `seed` is not finite, or when `random` returns a number outside `[0, 1)`.
 * @throws {@link TypeError} When `random` is present and is not a function.
 * @example
 * sampleItem([1, 2, 3])
 * @example
 * sampleItem({ array: [1, 2, 3], seed: 1 })
 */
export function sampleItem<Item>(array: readonly Item[]): Item | undefined;
export function sampleItem<Item>(
    params: SampleItemParams<Item>,
): Item | undefined;
export function sampleItem(input: unknown): unknown;
export function sampleItem(input: unknown): unknown {
    const params = readArrayParams<SampleItemParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined || array.length === 0) {
        return undefined;
    }
    const index = randomIndexBelow(randomFrom(params), array.length);
    return array[index] as unknown;
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
