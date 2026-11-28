/**
 * Parameters for {@link insertItems}.
 */
export interface InsertItemsParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Index at which to insert `items`.
     *
     * A negative index counts from the end. The array length appends.
     */
    index: number;

    /** Items to insert, in order. The array is not mutated. */
    items: readonly Item[];
}
