import type { ChunkParams } from "./chunk.types.js";
import { assertPositiveInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Splits an array into consecutive groups of `size` items.
 *
 * The last group holds the remainder when the length is not a multiple of
 * `size`. The input is not mutated. Each group is a new array, and holes
 * are copied as `undefined`.
 *
 * @param params - `array` and a positive integer `size`.
 * @returns The groups, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `size` is not a number.
 * @throws {@link RangeError} When `size` is not a positive finite integer.
 * @example
 * chunk({ array: [1, 2, 3, 4, 5], size: 2 })
 */
export function chunk<Item>(params: ChunkParams<Item>): Item[][] | undefined;
export function chunk(params: unknown): unknown[][] | undefined;
export function chunk(params: unknown): unknown[][] | undefined {
    const resolved = readParams<ChunkParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const size = assertPositiveInteger("size", resolved.size);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return splitChunks(array, size);
}

/**
 * Copies `array` into consecutive groups.
 *
 * @param array - The source array.
 * @param size - A positive group length.
 * @returns New groups. The last one may be shorter than `size`.
 */
function splitChunks<Item>(array: readonly Item[], size: number): Item[][] {
    const chunks: Item[][] = [];
    for (let index = 0; index < array.length; index += size) {
        const end = Math.min(index + size, array.length);
        const group: Item[] = [];
        for (let itemIndex = index; itemIndex < end; itemIndex += 1) {
            group.push(array[itemIndex] as Item);
        }
        chunks.push(group);
    }
    return chunks;
}
