import type { StringUnit } from "../types/string-unit.types.js";

/** Options for `pad`. */
export interface PadOptions {
    /** The text to pad. */
    value: string;
    /** The length to reach, in `unit`. */
    maximumLength: number;
    /**
     * Text to repeat. An empty string throws.
     *
     * @defaultValue `" "`
     */
    padString?: string;
    /**
     * Where the original text sits.
     *
     * @defaultValue `"center"`
     */
    align?: "start" | "end" | "center";
    /**
     * The unit of `maximumLength`.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
