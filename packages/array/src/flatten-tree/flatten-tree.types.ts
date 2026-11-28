/**
 * Parameters for {@link flattenTree}.
 */
export interface FlattenTreeParams<Item> {
    /** Roots of the forest. They are not mutated. */
    array: readonly Item[];

    /**
     * Property that holds a node's children when `getChildren` is omitted.
     *
     * @defaultValue "children"
     */
    childrenKey?: string;

    /**
     * Reads the children of a node.
     *
     * When this is set, `childrenKey` is ignored. A missing or non-array
     * result makes the node a leaf.
     */
    getChildren?: (node: Item) => unknown;
}
