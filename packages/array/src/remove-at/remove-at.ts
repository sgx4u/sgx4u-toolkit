import type { RemoveAtParams } from "./remove-at.types.js";
import {
    copyArray,
    resolveIndex,
    resolveInsertIndex,
} from "../utils/array.utils.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Removes items starting at an index and returns a new array.
 *
 * `count` defaults to `1`. A negative index counts from the end and, when
 * `count` is greater than `0`, must land on an existing element. `count`
 * of `0` is a no-op when the index resolves inside `0..length`, including
 * an index equal to the length. A `count` that extends past the end removes
 * through the end. A present `count` is checked before the source array.
 *
 * @param params - The source array, the index, and an optional count.
 * @returns The new array, or `undefined` when `array` is not an array or the index is out of range.
 * @throws {@link TypeError} When `count` is present and is not a number.
 * @throws {@link RangeError} When `count` is present and is not a finite integer greater than or equal to 0.
 * @example
 * removeAt({ array: [1, 2, 3, 4], index: 1, count: 2 });
 */
export function removeAt<Item>(
    params: RemoveAtParams<Item>,
): Item[] | undefined {
    const resolved = readParams<RemoveAtParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (resolved.count !== undefined) {
        assertNonNegativeInteger("count", resolved.count);
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const count = resolved.count === undefined ? 1 : resolved.count;
    const index =
        count === 0
            ? resolveInsertIndex(resolved.index, array.length)
            : resolveIndex(resolved.index, array.length);
    if (index === undefined) {
        return undefined;
    }
    const copy = copyArray(array);
    copy.splice(index, count);
    return copy;
}
