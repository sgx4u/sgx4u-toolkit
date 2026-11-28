import type { UnicodeForm } from "../types/string-unit.types.js";

/**
 * Options for `isNormalized`.
 */
export interface IsNormalizedOptions {
    /** The text to test. */
    value: string;
    /**
     * Normalization form to compare against.
     *
     * @defaultValue `"NFC"`
     */
    form?: UnicodeForm;
}
