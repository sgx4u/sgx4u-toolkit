/**
 * Arguments for {@link chunk}.
 */
export interface ChunkParams<Item> {
    /**
     * Items to split into consecutive groups.
     */
    array: readonly Item[];
    /**
     * Maximum number of items in one group. The last group can be shorter.
     */
    size: number;
}
