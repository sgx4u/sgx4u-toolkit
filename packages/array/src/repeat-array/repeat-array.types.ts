/**
 * Parameters for {@link repeatArray}.
 */
export interface RepeatArrayParams<Item> {
    /** Array to repeat. It is not mutated. */
    array: readonly Item[];

    /**
     * How many times to concatenate a shallow copy.
     *
     * `0` returns `[]`. `1` returns a shallow copy.
     */
    count: number;
}
