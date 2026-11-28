/**
 * Arguments for {@link take}.
 */
export interface TakeParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * How many leading items to keep.
     *
     * `0` keeps nothing. A count past the end keeps every item. The count
     * must be a finite integer greater than or equal to `0`.
     */
    count: number;
}
