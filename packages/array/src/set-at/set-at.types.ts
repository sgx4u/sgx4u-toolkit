/**
 * Parameters for {@link setAt}.
 */
export interface SetAtParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Index to replace.
     *
     * A negative index counts from the end.
     */
    index: number;

    /** Value to store. A function is stored, not called. */
    value: Item;
}
