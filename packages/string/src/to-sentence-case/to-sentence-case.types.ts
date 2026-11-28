import type { LocaleArgument } from "../utils/locale.utils.js";

/** Options for `toSentenceCase`. */
export interface ToSentenceCaseOptions {
    /** The text to convert. */
    value: string;
    /** Locale passed to casing. */
    locale?: LocaleArgument;
}
