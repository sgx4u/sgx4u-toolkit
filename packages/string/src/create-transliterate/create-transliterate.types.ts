import type { SlugifyTransliteratedOptions } from "../slugify-transliterated/slugify-transliterated.types.js";
import type { TransliterateOptions } from "../transliterate-text/transliterate.types.js";

/**
 * Transliteration and slug functions that share one {@link StringConfig}.
 */
export interface TransliterateToolkit {
    /**
     * Maps text to Latin letters with the bound locale.
     *
     * @param value - The text to map.
     * @returns The mapped text, or `undefined` when `value` is not a string.
     */
    transliterate(value: string): string | undefined;
    /**
     * @param options - `value` and an optional `locale` that overrides the bound one.
     * @returns The mapped text, or `undefined` when `value` is not a string.
     */
    transliterate(options: TransliterateOptions): string | undefined;
    /**
     * Builds a slug with the bound locale, separator, and lowercase flag.
     *
     * @param value - The text to slugify.
     * @returns The slug, or `undefined` when `value` is not a string.
     */
    slugifyTransliterated(value: string): string | undefined;
    /**
     * @param options - `value` plus overrides for locale, separator, and lowercase.
     * @returns The slug, or `undefined` when `value` is not a string.
     */
    slugifyTransliterated(
        options: SlugifyTransliteratedOptions,
    ): string | undefined;
}

export type { StringConfig } from "../types/string-config.types.js";
