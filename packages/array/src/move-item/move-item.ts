import type { MoveItemParams } from "./move-item.types.js";
import { copyArray, resolveIndex } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Moves the item at `from` so that it occupies `to` in the result.
 *
 * Both indexes must exist. Negative indexes count from the end. The item
 * is removed first, then inserted at `to` in that shorter array, which is
 * the result index. `[1, 2, 3, 4]` from `0` to `3` is `[2, 3, 4, 1]`. The
 * input is not mutated.
 *
 * @param params - The source array and the two indexes.
 * @returns The new array, or `undefined` when `array` is not an array or either index is out of range.
 * @example
 * moveItem({ array: [1, 2, 3, 4], from: 0, to: 3 });
 */
export function moveItem<Item>(
    params: MoveItemParams<Item>,
): Item[] | undefined {
    const resolved = readParams<MoveItemParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const fromIndex = resolveIndex(resolved.from, array.length);
    const toIndex = resolveIndex(resolved.to, array.length);
    if (fromIndex === undefined || toIndex === undefined) {
        return undefined;
    }
    const copy = copyArray(array);
    const removed = copy.splice(fromIndex, 1);
    const moved = removed[0] as Item;
    copy.splice(toIndex, 0, moved);
    return copy;
}
