import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `padEnd`. */
export interface PadEndOptions {
    /** The text to pad. */
    value: string;
    /** The length to reach. */
    maximumLength: number;
    /** @defaultValue `" "` */
    padString?: string;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
