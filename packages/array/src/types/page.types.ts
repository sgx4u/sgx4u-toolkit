/**
 * One page of items plus the metadata needed to render a pager.
 */
export interface PageResult<Item> {
    /** Items on this page. Empty when the page is past the end. */
    items: Item[];
    /** 1-based page number that was requested. */
    page: number;
    /** Maximum number of items on a page. */
    pageSize: number;
    /** Total pages. `0` when the source is empty. */
    pageCount: number;
    /** Number of items in the source. */
    totalCount: number;
    /** Index of the first item on this page in the source. */
    offset: number;
    /** Whether a lower page number exists. */
    hasPreviousPage: boolean;
    /** Whether a higher page number exists. */
    hasNextPage: boolean;
}
