/**
 * Parameters for {@link interleave}.
 */
export interface InterleaveParams<Item> {
    /**
     * Arrays to read in round-robin order.
     *
     * Every slot must be an array. An exhausted array is skipped.
     */
    arrays: readonly (readonly Item[])[];
}
