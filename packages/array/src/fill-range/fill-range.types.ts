/**
 * Parameters for {@link fillRange}.
 */
export interface FillRangeParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /** Value written into the range. */
    value: Item;

    /**
     * First index to fill, using the same rules as `Array#fill`.
     *
     * @defaultValue 0
     */
    start?: number;

    /**
     * Index at which filling stops, using the same rules as `Array#fill`.
     *
     * @defaultValue The array length
     */
    end?: number;
}
