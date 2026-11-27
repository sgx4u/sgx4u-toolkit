/**
 * Arguments for {@link getPermutations}.
 */
export interface GetPermutationsParams<Item> {
    /** Items to arrange. The array is not mutated. */
    array: readonly Item[];
    /**
     * How many items are in each permutation.
     *
     * Defaults to the array length. `0` returns `[[]]`. A size greater than
     * the length returns `[]`.
     */
    size?: number;
}
