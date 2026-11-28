import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for `toLowerCase`.
 */
export interface ToLowerCaseOptions {
    /** The text to convert. */
    value: string;
    /**
     * Locale passed to casing.
     *
     * @defaultValue the runtime locale
     */
    locale?: LocaleArgument;
}
