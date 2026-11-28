/**
 * Arguments for {@link getCombinations}.
 */
export interface GetCombinationsParams<Item> {
    /** Items to choose from. The array is not mutated. */
    array: readonly Item[];
    /**
     * How many items are in each combination.
     *
     * A finite integer greater than or equal to 0. `0` returns `[[]]`.
     * A size greater than the array length returns `[]`.
     */
    size: number;
}
