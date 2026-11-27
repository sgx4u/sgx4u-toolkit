/**
 * Parameters for {@link insertItem}.
 */
export interface InsertItemParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Index at which to insert `item`.
     *
     * A negative index counts from the end. The array length appends.
     */
    index: number;

    /** Item to insert. */
    item: Item;
}
