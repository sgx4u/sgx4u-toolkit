import type { Equals } from "../types/equals.types.js";
import type { Iteratee } from "../types/iteratee.types.js";

/**
 * Arguments for {@link diffArraysByKey}.
 */
export interface DiffArraysByKeyParams<Item> {
    /** The previous array. It is not mutated. */
    first: readonly Item[];
    /** The next array. It is not mutated. */
    second: readonly Item[];
    /**
     * Identity of an item.
     *
     * A property key or a function. Keys use SameValueZero. The first
     * occurrence of a key is the primary item. Later duplicates are extra.
     */
    key: Iteratee<Item>;
    /**
     * Compares the two items that share a key.
     *
     * Equal values at different indexes are `moved`. Unequal values are
     * `updated` only, even when the index also changed.
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;
}
