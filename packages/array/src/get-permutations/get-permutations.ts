import type { GetPermutationsParams } from "./get-permutations.types.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns ordered permutations in lexicographic index order.
 *
 * Arrangements are by index, so duplicate values can produce duplicate
 * permutations. Permutations of `n` items are `n!`. This function does not
 * throw when `n` is large; it builds every permutation. The input is not
 * mutated.
 *
 * `size` defaults to the full length. `size` of `0` returns `[[]]`. A size
 * greater than the length returns `[]`. A value that is not a params object,
 * or whose `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetPermutationsParams}.
 * @returns The permutations, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `size` is present and is not a number.
 * @throws {@link RangeError} When `size` is present and is not a finite integer greater than or equal to 0.
 * @example
 * getPermutations({ array: [1, 2, 3] })
 */
export function getPermutations<Item>(
    params: GetPermutationsParams<Item>,
): Item[][] | undefined;
export function getPermutations(input: unknown): unknown[][] | undefined;
export function getPermutations(input: unknown): unknown[][] | undefined {
    const params = readParams<GetPermutationsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const size =
        params.size === undefined
            ? array.length
            : assertNonNegativeInteger("size", params.size);
    return permutationsOf(array, size);
}

/**
 * @param array - The source array.
 * @param size - How many items to arrange.
 * @returns Permutations in lexicographic index order.
 */
function permutationsOf(array: readonly unknown[], size: number): unknown[][] {
    if (size === 0) {
        return [[]];
    }
    if (size > array.length) {
        return [];
    }
    const result: unknown[][] = [];
    const used: boolean[] = new Array<boolean>(array.length).fill(false);
    walkPermutations(array, size, used, [], result);
    return result;
}

/**
 * @param array - The source array.
 * @param size - How many items to arrange.
 * @param used - Indexes already chosen.
 * @param chosen - The permutation being built. Mutated only as a scratch list.
 * @param result - Permutations collected so far.
 */
function walkPermutations(
    array: readonly unknown[],
    size: number,
    used: boolean[],
    chosen: unknown[],
    result: unknown[][],
): void {
    if (chosen.length === size) {
        result.push(chosen.slice());
        return;
    }
    for (let index = 0; index < array.length; index += 1) {
        if (used[index] === true) {
            continue;
        }
        used[index] = true;
        chosen.push(array[index] as unknown);
        walkPermutations(array, size, used, chosen, result);
        chosen.pop();
        used[index] = false;
    }
}
