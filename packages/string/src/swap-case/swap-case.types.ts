import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `swapCase`. */
export interface SwapCaseOptions {
    /** The text to swap. */
    value: string;
    /** Locale passed to casing. */
    locale?: LocaleArgument;
}
