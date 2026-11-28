import type { InsertItemParams } from "./insert-item.types.js";
import { copyArray, resolveInsertIndex } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Inserts one item at an index and returns a new array.
 *
 * A negative index counts from the end. An index equal to the length
 * appends. An index that is not an integer, or that falls outside
 * `0..length`, returns `undefined`. The input is not mutated. Holes in
 * the source become `undefined` elements.
 *
 * @param params - The source array, the index, and the item.
 * @returns The new array, or `undefined` when `array` is not an array or the index is out of range.
 * @example
 * insertItem({ array: [1, 2, 3], index: 1, item: 9 });
 */
export function insertItem<Item>(
    params: InsertItemParams<Item>,
): Item[] | undefined {
    const resolved = readParams<InsertItemParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const index = resolveInsertIndex(resolved.index, array.length);
    if (index === undefined) {
        return undefined;
    }
    const copy = copyArray(array);
    copy.splice(index, 0, resolved.item);
    return copy;
}
