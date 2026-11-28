import type { TruncationLocation } from "../types/string-unit.types.js";
/** Options for `truncateToDisplayWidth`. */
export interface TruncateToDisplayWidthOptions {
    /** The text to shorten. */
    value: string;
    /** The maximum display width of the result. */
    maximumWidth: number;
    /** @defaultValue `"\u2026"` */
    omission?: string;
    /** @defaultValue `"end"` */
    location?: TruncationLocation;
}
