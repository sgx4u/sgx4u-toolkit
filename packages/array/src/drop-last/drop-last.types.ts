/**
 * Arguments for {@link dropLast}.
 */
export interface DropLastParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * How many trailing items to skip.
     *
     * `0` keeps every item. A count past the start returns an empty
     * array. The count must be a finite integer greater than or equal
     * to `0`.
     */
    count: number;
}
