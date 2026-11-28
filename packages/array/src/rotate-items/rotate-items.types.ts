/**
 * Parameters for {@link rotateItems}.
 */
export interface RotateItemsParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /**
     * How far to rotate.
     *
     * A positive count moves items toward the end. A negative count moves
     * items toward the start. The distance is taken modulo the length.
     */
    count: number;
}
