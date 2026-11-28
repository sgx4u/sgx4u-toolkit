import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `insertString`. */
export interface InsertStringOptions {
    value: string;
    index: number;
    insertion: string;
    /** @defaultValue `"grapheme"` */ unit?: StringUnit;
}
