import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `uncapitalize`. */
export interface UncapitalizeOptions {
    /** The text to change. */
    value: string;
    /** Locale passed to casing. */
    locale?: LocaleArgument;
}
