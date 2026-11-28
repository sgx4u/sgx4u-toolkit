/**
 * Parameters for {@link intersperse}.
 */
export interface IntersperseParams<Item, Separator> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /** Value placed between items. It is not added for an empty or single-item array. */
    separator: Separator;
}
