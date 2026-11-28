import type { Iteratee } from "../types/iteratee.types.js";
import type { ChunkByParams } from "./chunk-by.types.js";
import { sameValueZero } from "../utils/equality.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Splits an array where the `by` result changes.
 *
 * Consecutive items whose keys match under SameValueZero stay in one group.
 * `NaN` matches `NaN`, and `-0` matches `0`. A later repeat of an earlier
 * key starts a new group. The input is not mutated.
 *
 * @param params - `array` and an iteratee `by`.
 * @returns The groups, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is not a property key or a function.
 * @example
 * chunkBy({ array: [1, 1, 2, 2, 1], by: (item) => item })
 */
export function chunkBy<Item>(
    params: ChunkByParams<Item>,
): Item[][] | undefined;
export function chunkBy(params: unknown): unknown[][] | undefined;
export function chunkBy(params: unknown): unknown[][] | undefined {
    const resolved = readParams<ChunkByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertIteratee("by", resolved.by);
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const read = resolveIteratee(resolved.by as Iteratee<unknown>);
    return groupConsecutive(array, read);
}

/**
 * Builds a new group each time the key changes.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @returns Consecutive groups.
 */
function groupConsecutive<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
): Item[][] {
    const chunks: Item[][] = [];
    let current: Item[] = [];
    let previousKey: unknown;
    let hasPrevious = false;
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = read(item, index, array);
        if (!hasPrevious || !sameValueZero(key, previousKey)) {
            current = [item];
            chunks.push(current);
            previousKey = key;
            hasPrevious = true;
            continue;
        }
        current.push(item);
    }
    return chunks;
}
