import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link getDamerauLevenshteinDistance}.
 *
 * An adjacent transposition of two units costs 1.
 */
export interface GetDamerauLevenshteinDistanceOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
    /**
     * The unit each edit counts.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
