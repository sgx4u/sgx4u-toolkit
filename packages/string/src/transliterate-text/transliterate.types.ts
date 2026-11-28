import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for `transliterate`.
 */
export interface TransliterateOptions {
    /** The text to map to Latin letters. */
    value: string;
    /**
     * Locale that selects extra orthography. A German tag (`de`) maps
     * `ä`, `ö`, `ü`, and `ß` to `ae`, `oe`, `ue`, and `ss`.
     */
    locale?: LocaleArgument;
}
