import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `reverseString`. */
export interface ReverseStringOptions {
    /** The text to reverse. */
    value: string;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
