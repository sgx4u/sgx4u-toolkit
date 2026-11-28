import type { PaginateParams } from "./paginate.types.js";
import type { PageResult } from "../types/page.types.js";
import { rangeError } from "../utils/errors.utils.js";
import { assertInteger, assertPositiveInteger } from "../utils/number.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Returns one page of items plus the metadata for a pager.
 *
 * `page` is 1-based. A page past the end has `items: []` and still reports
 * `pageCount`, `offset`, and the neighbour flags. `pageCount` is `0` when
 * the source is empty, and otherwise `Math.ceil(totalCount / pageSize)`.
 * `offset` is `(page - 1) * pageSize`. `hasPreviousPage` is
 * `page > 1 && totalCount > 0`. `hasNextPage` is `page < pageCount`.
 *
 * A value that is not a params object, or whose `array` is not an array,
 * returns `undefined`. The items are a dense slice: a sparse hole becomes
 * `undefined`.
 *
 * @param input - {@link PaginateParams}.
 * @returns The page, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `page` or `pageSize` is not a number.
 * @throws {@link RangeError} When `page` is not a finite integer greater than or equal to 1, or when `pageSize` is not a positive integer.
 * @example
 * paginate({ array: ["a", "b", "c"], page: 1, pageSize: 2 })
 */
export function paginate<Item>(
    params: PaginateParams<Item>,
): PageResult<Item> | undefined;
export function paginate(input: unknown): PageResult<unknown> | undefined;
export function paginate(input: unknown): PageResult<unknown> | undefined {
    const params = readParams<PaginateParams<unknown>>(input);
    if (params === undefined) {
        return undefined;
    }
    const array = readArray(params.array);
    if (array === undefined) {
        return undefined;
    }
    const page = readPage(params.page);
    const pageSize = assertPositiveInteger("pageSize", params.pageSize);
    return pageOf(array, page, pageSize);
}

/**
 * @param page - The caller's page number.
 * @returns A finite integer greater than or equal to 1.
 */
function readPage(page: unknown): number {
    const integer = assertInteger("page", page);
    if (integer < 1) {
        throw rangeError(
            "page",
            "a finite integer greater than or equal to 1",
            integer,
        );
    }
    return integer;
}

/**
 * @param array - The source array.
 * @param page - A 1-based page number.
 * @param pageSize - A positive page size.
 * @returns The page. `items` is a new dense array.
 */
function pageOf(
    array: readonly unknown[],
    page: number,
    pageSize: number,
): PageResult<unknown> {
    const totalCount = array.length;
    const pageCount = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    return {
        items: denseSlice(array, offset, offset + pageSize),
        page,
        pageSize,
        pageCount,
        totalCount,
        offset,
        hasPreviousPage: page > 1 && totalCount > 0,
        hasNextPage: page < pageCount,
    };
}

/**
 * @param array - The source array.
 * @param start - The first index to copy.
 * @param end - The index one past the last item to copy.
 * @returns A new dense array. Indexes past the source are omitted.
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
