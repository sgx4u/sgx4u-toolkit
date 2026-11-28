import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `atString`. */
export interface AtStringOptions {
    /** The text. */
    value: string;
    /** The index. Negative values count from the end. */
    index: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
