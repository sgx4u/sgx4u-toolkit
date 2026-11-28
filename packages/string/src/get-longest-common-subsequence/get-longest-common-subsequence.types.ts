import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link getLongestCommonSubsequence}.
 *
 * The subsequence does not have to be contiguous.
 */
export interface GetLongestCommonSubsequenceOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
    /**
     * The unit the subsequence is built from.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
