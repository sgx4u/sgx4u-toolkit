import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link getDiceCoefficient}.
 *
 * The coefficient uses adjacent pairs of `unit`.
 */
export interface GetDiceCoefficientOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
    /**
     * The unit each bigram is built from.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
