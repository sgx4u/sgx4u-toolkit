/**
 * Parameters for {@link removeAt}.
 */
export interface RemoveAtParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Index of the first item to remove.
     *
     * A negative index counts from the end.
     */
    index: number;

    /**
     * How many items to remove, starting at `index`.
     *
     * @defaultValue 1
     */
    count?: number;
}
