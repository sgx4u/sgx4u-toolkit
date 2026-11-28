import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link splitWhen}.
 */
export interface SplitWhenParams<Item> {
    /** Array to split. */
    array: readonly Item[];

    /**
     * Reports whether this item starts the right side.
     *
     * Called as `predicate(item, index, array)`. The first match is the
     * first item of the right side. A hole is passed as `undefined`.
     */
    predicate: Predicate<Item>;
}
