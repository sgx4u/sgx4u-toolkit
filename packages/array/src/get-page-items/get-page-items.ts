import type { GetPageItemsParams } from "./get-page-items.types.js";
import { rangeError } from "../utils/errors.utils.js";
import { assertInteger, assertPositiveInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns the items on one page and nothing else.
 *
 * `page` is 1-based. A page past the end returns `[]`, not `undefined`, when
 * the array is valid. The slice is dense: a sparse hole becomes `undefined`.
 * A value that is not a params object, or whose `array` is not an array,
 * returns `undefined`.
 *
 * @param input - {@link GetPageItemsParams}.
 * @returns A new array of items, `[]` when the page is past the end, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `page` or `pageSize` is not a number.
 * @throws {@link RangeError} When `page` is not a finite integer greater than or equal to 1, or when `pageSize` is not a positive integer.
 * @example
 * getPageItems({ array: ["a", "b", "c"], page: 2, pageSize: 2 })
 */
export function getPageItems<Item>(
    params: GetPageItemsParams<Item>,
): Item[] | undefined;
export function getPageItems(input: unknown): unknown[] | undefined;
export function getPageItems(input: unknown): unknown[] | undefined {
    const params = readParams<GetPageItemsParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const page = assertInteger("page", params.page);
    if (page < 1) {
        throw rangeError(
            "page",
            "a finite integer greater than or equal to 1",
            page,
        );
    }
    const pageSize = assertPositiveInteger("pageSize", params.pageSize);
    const offset = (page - 1) * pageSize;
    return denseSlice(array, offset, offset + pageSize);
}

/**
 * @param array - The source array.
 * @param start - The first index to copy.
 * @param end - The index one past the last item to copy.
 * @returns A new dense array.
 */
function denseSlice(
    array: readonly unknown[],
    start: number,
    end: number,
): unknown[] {
    const items: unknown[] = [];
    const last = end < array.length ? end : array.length;
    for (let index = start; index < last; index += 1) {
        if (index < 0) {
            continue;
        }
        items.push(array[index] as unknown);
    }
    return items;
}
