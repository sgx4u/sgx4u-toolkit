import type { Predicate } from "../types/iteratee.types.js";

/**
 * Arguments for {@link dropWhile}.
 */
export interface DropWhileParams<Item> {
    /** Array to copy from. */
    array: readonly Item[];

    /**
     * Reports whether the next leading item should be skipped.
     *
     * Called as `predicate(item, index, array)`. The first falsy result
     * is kept. A hole is passed as `undefined`.
     */
    predicate: Predicate<Item>;
}
