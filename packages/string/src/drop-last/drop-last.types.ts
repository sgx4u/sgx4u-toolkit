import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `dropLast`. */
export interface DropLastOptions {
    /** The text. */
    value: string;
    /** How many units to take or drop. */
    count: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
