/**
 * Parameters for {@link concatArrays}.
 */
export interface ConcatArraysParams<Item> {
    /** Arrays to concatenate, in order. Every slot must be an array. */
    arrays: readonly (readonly Item[])[];

    /**
     * When true, arrays with length `0` are ignored.
     *
     * @defaultValue false
     */
    skipEmpty?: boolean;
}
