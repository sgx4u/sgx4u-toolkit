import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link getNgrams}.
 *
 * A bare string uses size `2` and graphemes.
 */
export interface GetNgramsOptions {
    /** Text to slice into overlapping groups. */
    value: string;
    /**
     * How many units each group contains.
     *
     * The size must be an integer of at least 1. A size longer than the
     * text returns an empty array.
     *
     * @defaultValue 2
     */
    size?: number;
    /**
     * The unit each group is built from.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
