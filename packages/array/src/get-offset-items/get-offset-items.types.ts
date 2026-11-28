/**
 * Arguments for {@link getOffsetItems}.
 */
export interface GetOffsetItemsParams<Item> {
    /** Items to slice. The array is not mutated. */
    array: readonly Item[];
    /**
     * Index of the first item.
     *
     * `0` is the start. A non-negative integer.
     */
    offset: number;
    /**
     * Maximum number of items to return.
     *
     * `0` returns an empty array.
     */
    limit: number;
}
