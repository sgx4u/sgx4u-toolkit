/**
 * Parameters for {@link createTimes}.
 */
export interface CreateTimesParams<Item> {
    /**
     * How many values to build.
     *
     * `0` returns `[]`. The indexes are `0` through `count - 1`.
     */
    count: number;

    /**
     * Maps an index to a value.
     *
     * When this is omitted, the result is the indexes themselves.
     */
    mapper?: (index: number) => Item;
}
