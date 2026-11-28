import { getCombinations } from "../get-combinations/get-combinations.js";
import { readArray } from "../utils/params.utils.js";

/**
 * Returns every subset, from the empty subset through the full array.
 *
 * Subsets are ordered by increasing size, and within a size by
 * lexicographic index order. A power set of `n` items has `2^n` subsets.
 * This function does not throw when `n` is large; it builds every subset.
 * A value that is not an array returns `undefined`. The input is not
 * mutated. Each subset is a new array.
 *
 * @param array - The source array.
 * @returns Every subset, or `undefined` when `array` is not an array.
 * @example
 * getPowerSet([1, 2])
 */
export function getPowerSet<Item>(array: readonly Item[]): Item[][];
export function getPowerSet(input: unknown): unknown[][] | undefined;
export function getPowerSet(input: unknown): unknown[][] | undefined {
    const array = readArray(input);
    if (array === undefined) {
        return undefined;
    }
    const subsets: unknown[][] = [];
    for (let size = 0; size <= array.length; size += 1) {
        const combinations = getCombinations({ array, size });
        if (combinations === undefined) {
            return undefined;
        }
        for (const combination of combinations) {
            subsets.push(combination);
        }
    }
    return subsets;
}
