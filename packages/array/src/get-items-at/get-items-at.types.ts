/**
 * Arguments for {@link getItemsAt}.
 */
export interface GetItemsAtParams<Item> {
    /** Array to read. */
    array: readonly Item[];

    /**
     * Positions to read, in the order to return them.
     *
     * A negative index counts from the end. An out-of-range index and a
     * non-integer are skipped. Duplicates are kept. The value itself must
     * be an array.
     */
    indexes: readonly unknown[];
}
