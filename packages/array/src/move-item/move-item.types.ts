/**
 * Parameters for {@link moveItem}.
 */
export interface MoveItemParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Index of the item to move.
     *
     * A negative index counts from the end.
     */
    from: number;

    /**
     * Index the item occupies in the result.
     *
     * A negative index counts from the end. The index must exist.
     */
    to: number;
}
