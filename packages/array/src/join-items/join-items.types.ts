/**
 * Parameters for {@link joinItems}.
 */
export interface JoinItemsParams<Item> {
    /** Items to format and join. The array is not mutated. */
    array: readonly Item[];

    /**
     * Text placed between items, except before the last item when
     * `lastSeparator` is set.
     *
     * @defaultValue ", "
     */
    separator?: string;

    /**
     * Text placed before the last item.
     *
     * When this is omitted, `separator` is used there too. Two items use
     * only this value when it is set.
     */
    lastSeparator?: string;

    /**
     * Formats one item.
     *
     * @defaultValue String
     */
    format?: (item: Item, index: number) => string;
}
