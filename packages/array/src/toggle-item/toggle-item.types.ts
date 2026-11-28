import type { Equals } from "../types/equals.types.js";

/**
 * Where {@link toggleItem} inserts an item that is not already present.
 */
export type TogglePlacement = "start" | "end";

/**
 * Parameters for {@link toggleItem}.
 */
export interface ToggleItemParams<Item> {
    /** Source array. It is not mutated. */
    array: readonly Item[];

    /** Item to remove, or to insert when it is absent. */
    item: Item;

    /**
     * Compares an element with `item`.
     *
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;

    /**
     * Where to insert `item` when no equal element exists.
     *
     * @defaultValue "end"
     */
    placement?: TogglePlacement;
}
