import type {
    StringUnit,
    TruncationLocation,
} from "../types/string-unit.types.js";

/** Options for `truncate`. */
export interface TruncateOptions {
    /** The text to shorten. */
    value: string;
    /** The maximum length of the result, in `unit`. */
    maximumLength: number;
    /**
     * Text that replaces the removed part.
     *
     * @defaultValue `"\u2026"`
     */
    omission?: string;
    /**
     * Which side of the text is kept.
     *
     * @defaultValue `"end"`
     */
    location?: TruncationLocation;
    /**
     * The unit of `maximumLength`.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
    /**
     * When `location` is `"end"`, trim the kept text back to the last match.
     */
    separator?: string | RegExp;
}
