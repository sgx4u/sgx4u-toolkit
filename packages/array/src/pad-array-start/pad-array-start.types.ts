/**
 * Parameters for {@link padArrayStart}.
 */
export interface PadArrayStartParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Length of the result.
     *
     * A source that is already at least this long is copied unchanged.
     */
    length: number;

    /** Value repeated at the start until `length` is reached. */
    value: Item;
}
