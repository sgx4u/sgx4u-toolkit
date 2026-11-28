import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for `capitalize`.
 */
export interface CapitalizeOptions {
    /** The text to capitalize. */
    value: string;
    /** Locale passed to casing. */
    locale?: LocaleArgument;
    /**
     * Lowercase everything after the first grapheme.
     *
     * @defaultValue true
     */
    restToLowerCase?: boolean;
}
