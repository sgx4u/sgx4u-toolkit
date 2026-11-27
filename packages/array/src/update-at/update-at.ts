import type { UpdateAtParams } from "./update-at.types.js";
import { copyArray, resolveIndex } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Replaces the item at an index and returns a new array.
 *
 * `updater` is either the next item or a function `(item, index) => item`.
 * A function is always called, so a function value cannot be stored with
 * this function. An index that is not an integer, or that falls outside the
 * array, returns `undefined`. The input is not mutated.
 *
 * @param params - The source array, the index, and the updater.
 * @returns The new array, or `undefined` when `array` is not an array or the index is out of range.
 * @example
 * updateAt({ array: [1, 2, 3], index: 1, updater: (item) => item * 10 });
 */
export function updateAt<Item>(
    params: UpdateAtParams<Item>,
): Item[] | undefined {
    const resolved = readParams<UpdateAtParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const index = resolveIndex(resolved.index, array.length);
    if (index === undefined) {
        return undefined;
    }
    const copy = copyArray(array);
    copy[index] = nextItem(copy[index] as Item, index, resolved.updater);
    return copy;
}

/**
 * Reads the next item from a value or from an updater function.
 *
 * @param item - The current item.
 * @param index - The resolved index.
 * @param updater - A replacement item, or a function that returns one.
 * @returns The item to store.
 */
function nextItem<Item>(
    item: Item,
    index: number,
    updater: Item | ((item: Item, index: number) => Item),
): Item {
    if (typeof updater === "function") {
        const update = updater as (current: Item, itemIndex: number) => Item;
        return update(item, index);
    }
    return updater;
}
