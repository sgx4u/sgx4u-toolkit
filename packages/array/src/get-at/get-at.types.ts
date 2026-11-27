/**
 * Arguments for {@link getAt}.
 */
export interface GetAtParams<Item> {
    /** Array to read. */
    array: readonly Item[];

    /**
     * Position to read.
     *
     * A negative index counts from the end, as `Array#at` does. A
     * non-integer, or an index outside the array, returns `undefined`
     * rather than throwing.
     */
    index: number;
}
