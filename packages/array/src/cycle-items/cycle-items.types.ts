/**
 * Parameters for {@link cycleItems}.
 */
export interface CycleItemsParams<Item> {
    /** Source array. It is not mutated. An empty array yields no items. */
    array: readonly Item[];

    /**
     * How many items to take, wrapping to the start.
     *
     * `0` returns `[]`.
     */
    count: number;
}
