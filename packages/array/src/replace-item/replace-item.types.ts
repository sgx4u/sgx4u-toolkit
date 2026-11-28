import type { Equals } from "../types/equals.types.js";

/**
 * Parameters for {@link replaceItem}.
 */
export interface ReplaceItemParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /** Item to find. */
    item: Item;

    /** Value written in place of a match. */
    replacement: Item;

    /**
     * Compares an element with `item`.
     *
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;

    /**
     * When true, every match is replaced. Otherwise only the first match is.
     *
     * @defaultValue false
     */
    all?: boolean;
}
