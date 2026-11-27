/**
 * Arguments for {@link paginate}.
 */
export interface PaginateParams<Item> {
    /** Items to page. The array is not mutated. */
    array: readonly Item[];
    /**
     * 1-based page number.
     *
     * A page past the end still returns metadata and an empty `items` array.
     */
    page: number;
    /** Maximum number of items on a page. A positive integer. */
    pageSize: number;
}
