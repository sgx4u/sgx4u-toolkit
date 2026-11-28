import type { StringUnit } from "../types/string-unit.types.js";

/**
 * Options for {@link maskString}.
 *
 * A bare string masks every unit.
 */
export interface MaskStringOptions {
    /** Text to mask. */
    value: string;
    /**
     * The mask text. The first grapheme is written once per masked unit.
     *
     * An empty string is rejected.
     *
     * @defaultValue `"*"`
     */
    maskCharacter?: string;
    /**
     * Units left visible at the start.
     *
     * @defaultValue 0
     */
    unmaskedStartLength?: number;
    /**
     * Units left visible at the end.
     *
     * @defaultValue 0
     */
    unmaskedEndLength?: number;
    /**
     * The unit that `unmaskedStartLength` and `unmaskedEndLength` count.
     *
     * @defaultValue `"grapheme"`
     */
    unit?: StringUnit;
}
