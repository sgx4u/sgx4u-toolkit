/**
 * Arguments for {@link drop}.
 */
export interface DropParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * How many leading items to skip.
     *
     * `0` keeps every item. A count past the end returns an empty array.
     * The count must be a finite integer greater than or equal to `0`.
     */
    count: number;
}
