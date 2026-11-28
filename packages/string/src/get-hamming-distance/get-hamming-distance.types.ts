import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link getHammingDistance}.
 *
 * The distance is undefined when the two strings have different lengths
 * in `unit`.
 */
export interface GetHammingDistanceOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
    /**
     * The unit each position counts.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
