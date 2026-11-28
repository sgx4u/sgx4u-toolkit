import type { UnicodeForm } from "../types/string-unit.types.js";

/**
 * Options for `normalizeUnicode`.
 */
export interface NormalizeUnicodeOptions {
    /** The text to normalize. */
    value: string;
    /**
     * Normalization form.
     *
     * @defaultValue `"NFC"`
     */
    form?: UnicodeForm;
}
