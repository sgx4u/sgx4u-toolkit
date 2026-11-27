import type { InsertItemsParams } from "./insert-items.types.js";
import { copyArray, resolveInsertIndex } from "../utils/array.utils.js";
import { typeError } from "../utils/errors.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Inserts several items at an index and returns a new array.
 *
 * Index rules match {@link insertItem}. `items` must be an array when this
 * is a real call. A present `items` value that is not an array throws
 * before the source array is read. The inputs are not mutated.
 *
 * @param params - The source array, the index, and the items to insert.
 * @returns The new array, or `undefined` when `array` is not an array or the index is out of range.
 * @throws {@link TypeError} When `items` is present and is not an array, or when `array` is an array and `items` is missing.
 * @example
 * insertItems({ array: [1, 4], index: 1, items: [2, 3] });
 */
export function insertItems<Item>(
    params: InsertItemsParams<Item>,
): Item[] | undefined {
    const resolved = readParams<InsertItemsParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (!Array.isArray(resolved.items)) {
        throw typeError("items", "an array", resolved.items);
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
    copy.splice(index, 0, ...copyArray(resolved.items));
    return copy;
}
