/**
 * Parameters for {@link updateAt}.
 */
export interface UpdateAtParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Index to update.
     *
     * A negative index counts from the end.
     */
    index: number;

    /**
     * Replacement item, or a function of the current item and its index.
     *
     * A function is always called. Use `setAt` to store a function value.
     */
    updater: Item | ((item: Item, index: number) => Item);
}
