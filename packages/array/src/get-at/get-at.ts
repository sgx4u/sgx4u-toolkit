import type { GetAtParams } from "./get-at.types.js";
import { readItem, resolveIndex } from "../utils/array.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the item at `index`.
 *
 * A negative index counts from the end. A non-integer index, or an index
 * outside the array, returns `undefined` and does not throw. The result is
 * the item itself, not a copy of the array. A hole is `undefined`. The
 * array is not mutated. A non-array `array`, or a non-object argument,
 * returns `undefined`.
 *
 * @param params - `array` and `index`.
 * @returns The item at `index`, or `undefined` when the index cannot be read.
 * @example
 * getAt({ array: [1, 2, 3], index: -1 });
 */
export function getAt<Item>(params: GetAtParams<Item>): Item | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` cannot be read.
 */
export function getAt(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function getAt(params: unknown): unknown {
    const parsed = readParams<GetAtParams<unknown>>(params);
    if (parsed === undefined) {
        return undefined;
    }
    const array = readArray(parsed.array);
    if (array === undefined) {
        return undefined;
    }
    const index = resolveIndex(parsed.index, array.length);
    if (index === undefined) {
        return undefined;
    }
    return readItem(array, index);
}
