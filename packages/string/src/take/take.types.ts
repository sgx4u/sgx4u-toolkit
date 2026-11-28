import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `take`. */
export interface TakeOptions {
    /** The text. */
    value: string;
    /** How many units to take or drop. */
    count: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
