import type { StringUnit } from "../types/string-unit.types.js";
/** Options for `sliceString`. */
export interface SliceStringOptions {
    /** The text to slice. */
    value: string;
    /** @defaultValue 0 */
    start?: number;
    /** Exclusive end. Omit to keep the tail. */
    end?: number;
    /** @defaultValue `"grapheme"` */
    unit?: StringUnit;
}
