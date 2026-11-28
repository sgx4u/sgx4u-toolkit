import type { RemoveAtIndexesParams } from "./remove-at-indexes.types.js";
import { resolveIndex } from "../utils/array.utils.js";
import { typeError } from "../utils/errors.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Removes every listed index and returns a new array.
 *
 * Negative indexes count from the end. Out-of-range indexes and values
 * that are not integers are skipped. Duplicate indexes remove the element
 * once. The order of `indexes` does not change which items remain. A
 * present `indexes` value that is not an array throws before the source
 * array is read.
 *
 * @param params - The source array and the indexes to remove.
 * @returns The kept items, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `indexes` is present and is not an array, or when `array` is an array and `indexes` is missing.
 * @example
 * removeAtIndexes({ array: [1, 2, 3, 4], indexes: [0, -1] });
 */
export function removeAtIndexes<Item>(
    params: RemoveAtIndexesParams<Item>,
): Item[] | undefined {
    const resolved = readParams<RemoveAtIndexesParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (!Array.isArray(resolved.indexes)) {
        throw typeError("indexes", "an array", resolved.indexes);
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return withoutIndexes(array, resolved.indexes);
}

/**
 * Copies `array`, leaving out every in-range index.
 *
 * @param array - The source array.
 * @param indexes - Caller-supplied indexes. Invalid entries are skipped.
 * @returns The kept items.
 */
function withoutIndexes<Item>(
    array: readonly Item[],
    indexes: readonly unknown[],
): Item[] {
    const removed = new Set<number>();
    for (const index of indexes) {
        if (typeof index !== "number") {
            continue;
        }
        const resolvedIndex = resolveIndex(index, array.length);
        if (resolvedIndex === undefined) {
            continue;
        }
        removed.add(resolvedIndex);
    }
    const result: Item[] = [];
    for (let index = 0; index < array.length; index += 1) {
        if (removed.has(index)) {
            continue;
        }
        result.push(array[index] as Item);
    }
    return result;
}
