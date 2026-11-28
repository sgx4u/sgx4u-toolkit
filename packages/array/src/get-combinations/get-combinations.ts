import type { GetCombinationsParams } from "./get-combinations.types.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns combinations in lexicographic index order.
 *
 * Each combination is a new array of items taken by increasing index, without
 * regard to order. Duplicate values are kept when they sit at different
 * indexes. The input is not mutated. This does not throw when `size` is
 * large; it builds every combination.
 *
 * `size` of `0` returns `[[]]`. A size greater than the length returns `[]`.
 * A value that is not a params object, or whose `array` is not an array,
 * returns `undefined`.
 *
 * @param input - {@link GetCombinationsParams}.
 * @returns The combinations, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `size` is not a number.
 * @throws {@link RangeError} When `size` is not a finite integer greater than or equal to 0.
 * @example
 * getCombinations({ array: [1, 2, 3], size: 2 })
 */
export function getCombinations<Item>(
    params: GetCombinationsParams<Item>,
): Item[][] | undefined;
export function getCombinations(input: unknown): unknown[][] | undefined;
export function getCombinations(input: unknown): unknown[][] | undefined {
    const params = readParams<GetCombinationsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const size = assertNonNegativeInteger("size", params.size);
    return combinationsOf(array, size);
}

/**
 * @param array - The source array.
 * @param size - How many items to choose. Already validated.
 * @returns Combinations in lexicographic index order.
 */
function combinationsOf(array: readonly unknown[], size: number): unknown[][] {
    if (size === 0) {
        return [[]];
    }
    if (size > array.length) {
        return [];
    }
    const result: unknown[][] = [];
    walkCombinations(array, size, 0, [], result);
    return result;
}

/**
 * @param array - The source array.
 * @param size - How many items to choose.
 * @param start - The first index still available.
 * @param chosen - The combination being built. Mutated only as a scratch list.
 * @param result - Combinations collected so far.
 */
function walkCombinations(
    array: readonly unknown[],
    size: number,
    start: number,
    chosen: unknown[],
    result: unknown[][],
): void {
    if (chosen.length === size) {
        result.push(chosen.slice());
        return;
    }
    for (let index = start; index < array.length; index += 1) {
        chosen.push(array[index] as unknown);
        walkCombinations(array, size, index + 1, chosen, result);
        chosen.pop();
    }
}
