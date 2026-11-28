/**
 * Arguments for {@link getBestItem}.
 */
export interface GetBestItemParams<Item> {
    /** Items to compare. The array is not mutated. */
    array: readonly Item[];
    /**
     * Reports whether `candidate` should replace `champion`.
     *
     * The walk is left to right. The first item is the first champion.
     */
    isBetter: (candidate: Item, champion: Item) => boolean;
}
