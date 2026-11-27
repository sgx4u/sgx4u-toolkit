/**
 * Arguments for {@link getPageItems}.
 */
export interface GetPageItemsParams<Item> {
    /** Items to page. The array is not mutated. */
    array: readonly Item[];
    /** 1-based page number. */
    page: number;
    /** Maximum number of items on a page. A positive integer. */
    pageSize: number;
}
