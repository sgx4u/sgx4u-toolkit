import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for `getStringLength`.
 */
export interface GetStringLengthOptions {
    /** The string to measure. */
    value: string;
    /**
     * The unit to count.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
    /**
     * Locale passed to the grapheme segmenter. Ignored for code points and code units.
     *
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
}
