import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for `toUpperCase`.
 */
export interface ToUpperCaseOptions {
    /** The text to convert. */
    value: string;
    /**
     * Locale passed to casing.
     *
     * @defaultValue the runtime locale
     */
    locale?: LocaleArgument;
}
