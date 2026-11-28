import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link getLevenshteinDistance}.
 *
 * Distance is counted in `unit`. The default unit is a grapheme.
 */
export interface GetLevenshteinDistanceOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
    /**
     * The unit each insertion, deletion, or substitution counts.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
