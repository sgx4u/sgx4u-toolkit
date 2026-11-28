/**
 * Parameters for {@link removeAtIndexes}.
 */
export interface RemoveAtIndexesParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * Indexes to remove.
     *
     * A negative index counts from the end. Order does not matter.
     * Out-of-range indexes and non-integers are skipped. A duplicate
     * index removes that element once.
     */
    indexes: readonly number[];
}
