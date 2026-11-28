import type { RotateItemsParams } from "./rotate-items.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Rotates items by `count` and returns a new array.
 *
 * A positive count moves items toward the end: `[1, 2, 3]` and `1` becomes
 * `[3, 1, 2]`. A negative count moves items toward the start: `-1` becomes
 * `[2, 3, 1]`. The distance is `count` modulo the length. An empty array
 * returns `[]` for any finite integer count. A normalized distance of `0`
 * returns a shallow copy. A present `count` is checked before the source
 * array is read.
 *
 * @param params - The source array and the rotation distance.
 * @returns The rotated array, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `count` is present and is not a number, or when a real array omits `count`.
 * @throws {@link RangeError} When `count` is not a finite integer.
 * @example
 * rotateItems({ array: [1, 2, 3], count: 1 });
 */
export function rotateItems<Item>(
    params: RotateItemsParams<Item>,
): Item[] | undefined {
    const resolved = readParams<RotateItemsParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    const count = assertInteger("count", resolved.count);
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    return rotateBy(array, count);
}

/**
 * Moves the last `normalized` items to the front.
 *
 * @param array - The source array.
 * @param count - A finite integer distance. Negatives are allowed.
 * @returns The rotated array.
 */
function rotateBy<Item>(array: readonly Item[], count: number): Item[] {
    if (array.length === 0) {
        return [];
    }
    const normalized = ((count % array.length) + array.length) % array.length;
    if (normalized === 0) {
        return copyArray(array);
    }
    const copy = copyArray(array);
    const tail = copy.slice(copy.length - normalized);
    const head = copy.slice(0, copy.length - normalized);
    return tail.concat(head);
}
