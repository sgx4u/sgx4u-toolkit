/**
 * Parameters for {@link repeatItem}.
 */
export interface RepeatItemParams<Item> {
    /** Value stored in every slot. The same reference is reused. */
    item: Item;

    /**
     * How many copies to store.
     *
     * `0` returns `[]`.
     */
    count: number;
}
