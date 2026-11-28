/**
 * Arguments for {@link getCartesianProduct}.
 */
export interface GetCartesianProductParams<Item> {
    /**
     * Arrays to combine.
     *
     * The last array varies fastest. An empty list, or any empty array,
     * produces no tuples.
     */
    arrays: readonly (readonly Item[])[];
}
