import type { SwapItemsParams } from "./swap-items.types.js";
import { copyArray, resolveIndex } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Swaps the items at two indexes and returns a new array.
 *
 * Negative indexes count from the end. The same index returns a shallow
 * copy. An index that is not an integer, or that falls outside the array,
 * returns `undefined`. The input is not mutated.
 *
 * @param params - The source array and the two indexes.
 * @returns The new array, or `undefined` when `array` is not an array or either index is out of range.
 * @example
 * swapItems({ array: [1, 2, 3], first: 0, second: 2 });
 */
export function swapItems<Item>(
    params: SwapItemsParams<Item>,
): Item[] | undefined {
    const resolved = readParams<SwapItemsParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const firstIndex = resolveIndex(resolved.first, array.length);
    const secondIndex = resolveIndex(resolved.second, array.length);
    if (firstIndex === undefined || secondIndex === undefined) {
        return undefined;
    }
    const copy = copyArray(array);
    if (firstIndex === secondIndex) {
        return copy;
    }
    const firstItem = copy[firstIndex] as Item;
    copy[firstIndex] = copy[secondIndex] as Item;
    copy[secondIndex] = firstItem;
    return copy;
}
