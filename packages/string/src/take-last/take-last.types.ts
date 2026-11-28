import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `takeLast`. */
export interface TakeLastOptions {
    /** The text. */
    value: string;
    /** How many units to take or drop. */
    count: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
