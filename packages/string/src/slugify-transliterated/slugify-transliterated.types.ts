import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for `slugifyTransliterated`.
 */
export interface SlugifyTransliteratedOptions {
    /** The text to transliterate and slugify. */
    value: string;
    /**
     * Locale passed to transliteration and to lowercase. A German tag
     * maps umlauts to two-letter spellings before the slug is built.
     */
    locale?: LocaleArgument;
    /**
     * Text inserted between letter and digit runs.
     *
     * @defaultValue `"-"`
     */
    separator?: string;
    /**
     * When `true`, the slug is lowercased after transliteration.
     *
     * @defaultValue true
     */
    lowerCase?: boolean;
}
