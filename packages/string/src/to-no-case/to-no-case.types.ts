import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `toNoCase`. */
export interface ToNoCaseOptions {
    /** The text to convert. */
    value: string;
    /** Locale passed to casing. */
    locale?: LocaleArgument;
}
