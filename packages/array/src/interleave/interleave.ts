import type { InterleaveParams } from "./interleave.types.js";
import { readItem } from "../utils/array.utils.js";
import { readArrayList, readParams } from "../utils/params.utils.js";

/**
 * Reads arrays in round-robin order and returns a new array.
 *
 * The first items are taken first, then the second items, and so on. An
 * exhausted array is skipped. An empty list returns `[]`. A slot that is
 * not an array returns `undefined`. The inputs are not mutated.
 *
 * @param params - The arrays to interleave.
 * @returns The interleaved items, or `undefined` when `arrays` is not an array of arrays.
 * @example
 * interleave({ arrays: [[1, 2, 3], [4], [5, 6]] });
 */
export function interleave<Item>(
    params: InterleaveParams<Item>,
): Item[] | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function interleave(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function interleave(params: unknown): unknown[] | undefined {
    const resolved = readParams<InterleaveParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const arrays = readArrayList<unknown>(resolved.arrays);
    if (arrays === undefined) {
        return undefined;
    }
    return roundRobin(arrays);
}

/**
 * Takes one item from each array that still has one, then repeats.
 *
 * @param arrays - The source arrays.
 * @returns The interleaved items.
 */
function roundRobin(arrays: readonly (readonly unknown[])[]): unknown[] {
    let longest = 0;
    for (const array of arrays) {
        if (array.length > longest) {
            longest = array.length;
        }
    }
    const result: unknown[] = [];
    for (let index = 0; index < longest; index += 1) {
        for (const array of arrays) {
            if (index < array.length) {
                result.push(readItem(array, index));
            }
        }
    }
    return result;
}
