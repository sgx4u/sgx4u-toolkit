import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link takeWhile}.
 */
export interface TakeWhileParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * Reports whether the leading run still holds.
     *
     * Called as `predicate(item, index, array)`. The first falsy result
     * stops the copy. A hole is passed as `undefined`.
     */
    predicate: Predicate<Item>;
}
