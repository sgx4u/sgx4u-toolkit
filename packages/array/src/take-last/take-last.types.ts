/**
 * Arguments for {@link takeLast}.
 */
export interface TakeLastParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * How many trailing items to keep.
     *
     * `0` keeps nothing. A count past the start keeps every item. The
     * count must be a finite integer greater than or equal to `0`.
     */
    count: number;
}
