import type { GetOffsetItemsParams } from "./get-offset-items.types.js";
import { assertNonNegativeInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns a dense slice starting at `offset`.
 *
 * `offset` of `0` is the start. `limit` of `0` returns `[]`. An offset past
 * the end returns `[]`, not `undefined`, when the array is valid. A sparse
 * hole becomes `undefined`. A value that is not a params object, or whose
 * `array` is not an array, returns `undefined`.
 *
 * @param input - {@link GetOffsetItemsParams}.
 * @returns A new array, `[]` when nothing is in range, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `offset` or `limit` is not a number.
 * @throws {@link RangeError} When `offset` or `limit` is not a finite integer greater than or equal to 0.
 * @example
 * getOffsetItems({ array: ["a", "b", "c"], offset: 1, limit: 2 })
 */
export function getOffsetItems<Item>(
    params: GetOffsetItemsParams<Item>,
): Item[] | undefined;
export function getOffsetItems(input: unknown): unknown[] | undefined;
export function getOffsetItems(input: unknown): unknown[] | undefined {
    const params = readParams<GetOffsetItemsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const offset = assertNonNegativeInteger("offset", params.offset);
    const limit = assertNonNegativeInteger("limit", params.limit);
    if (limit === 0) {
        return [];
    }
    const items: unknown[] = [];
    const end = offset + limit;
    const last = end < array.length ? end : array.length;
    for (let index = offset; index < last; index += 1) {
        items.push(array[index] as unknown);
    }
    return items;
}
