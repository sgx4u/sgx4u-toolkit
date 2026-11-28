import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `toCapitalCase`. */
export interface ToCapitalCaseOptions {
    /** The text to convert. */
    value: string;
    /** Locale passed to casing. */
    locale?: LocaleArgument;
}
