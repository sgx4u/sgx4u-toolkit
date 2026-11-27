import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link dropLastWhile}.
 */
export interface DropLastWhileParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * Reports whether the next trailing item should be skipped.
     *
     * Called as `predicate(item, index, array)`. The scan walks from the
     * end. A hole is passed as `undefined`.
     */
    predicate: Predicate<Item>;
}
