/**
 * Parameters for {@link swapItems}.
 */
export interface SwapItemsParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * First index.
     *
     * A negative index counts from the end.
     */
    first: number;

    /**
     * Second index.
     *
     * A negative index counts from the end.
     */
    second: number;
}
