import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link takeLastWhile}.
 */
export interface TakeLastWhileParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * Reports whether the trailing run still holds.
     *
     * Called as `predicate(item, index, array)`. The scan walks from the
     * end and stops at the first falsy result. A hole is passed as
     * `undefined`.
     */
    predicate: Predicate<Item>;
}
