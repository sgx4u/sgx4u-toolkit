import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `drop`. */
export interface DropOptions {
    /** The text. */
    value: string;
    /** How many units to take or drop. */
    count: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
