import type { Equals } from "../types/equals.types.js";

/**
 * Arguments for {@link getLongestCommonSubsequence}.
 */
export interface GetLongestCommonSubsequenceParams<Item> {
    /** The first sequence. Result items come from here. It is not mutated. */
    first: readonly Item[];
    /** The second sequence. It is not mutated. */
    second: readonly Item[];
    /**
     * Compares two items.
     * @defaultValue SameValueZero
     */
    equals?: Equals<Item>;
}
