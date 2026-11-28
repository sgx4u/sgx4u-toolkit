import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `replaceRange`. */
export interface ReplaceRangeOptions {
    value: string;
    start: number;
    end: number;
    replacement: string;
    /** @defaultValue `"grapheme"` */ unit?: StringUnit;
}
