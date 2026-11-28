import type { SetAtParams } from "./set-at.types.js";
import { copyArray, resolveIndex } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Replaces the item at an index, like `Array#with`, and returns a new array.
 *
 * A negative index counts from the end. An index that is not an integer, or
 * that falls outside the array, returns `undefined`. A function `value` is
 * stored and is not called. The input is not mutated.
 *
 * @param params - The source array, the index, and the value.
 * @returns The new array, or `undefined` when `array` is not an array or the index is out of range.
 * @example
 * setAt({ array: [1, 2, 3], index: -1, value: 9 });
 */
export function setAt<Item>(params: SetAtParams<Item>): Item[] | undefined {
    const resolved = readParams<SetAtParams<Item>>(params);
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
    return copyArray(array).with(index, resolved.value);
}
