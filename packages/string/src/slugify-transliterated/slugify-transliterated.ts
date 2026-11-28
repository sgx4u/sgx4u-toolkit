import { transliterateText } from "../transliterate-text/transliterate.js";
import { readBoolean, readOptionalString } from "../utils/assertions.utils.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { SlugifyTransliteratedOptions } from "./slugify-transliterated.types.js";

export type { SlugifyTransliteratedOptions } from "./slugify-transliterated.types.js";

/**
 * Slug options after defaults are applied.
 */
interface SlugOptions {
    /** Locale for transliteration and lowercase. */
    locale: LocaleArgument | undefined;
    /** Separator between runs. */
    separator: string;
    /** Whether the slug is lowercased. */
    lowerCase: boolean;
}

/**
 * Builds a slug from the transliteration of `value`.
 *
 * The text is transliterated, then optionally lowercased. Each run of
 * characters that are not letters or digits becomes one `separator`.
 * Separators are removed from both ends. The default separator is `-`
 * and the default is lowercase, so `Hello, World!` becomes `hello-world`.
 * A non-string returns `undefined`. The input is not changed.
 *
 * @param value - The text to slugify.
 * @returns The slug, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * slugifyTransliterated("Hello, World!");
 */
export function slugifyTransliterated(value: string): string | undefined;
/**
 * @param options - `value`, `locale`, `separator`, and `lowerCase`.
 * @returns The slug, or `undefined` when `value` is not a string.
 */
export function slugifyTransliterated(
    options: SlugifyTransliteratedOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The slug, or `undefined` when `value` is not a string.
 */
export function slugifyTransliterated(
    valueOrOptions: unknown,
): string | undefined {
    const resolved = readStringCall(valueOrOptions, readSlugOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return slugifyText(
        resolved.value,
        resolved.options.locale,
        resolved.options.separator,
        resolved.options.lowerCase,
    );
}

/**
 * Reads slug options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns Options with separator and lowercase set.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `locale` is empty.
 */
function readSlugOptions(record: Record<string, unknown>): SlugOptions {
    const separator = readOptionalString("separator", record.separator);
    return {
        locale: readLocale(record.locale),
        separator: separator ?? "-",
        lowerCase: readBoolean("lowerCase", record.lowerCase, true),
    };
}

/**
 * Transliterates `value` and joins the letter and digit runs.
 *
 * @param value - The original text.
 * @param locale - Locale for transliteration and lowercase.
 * @param separator - Text placed between runs.
 * @param lowerCase - Whether to lowercase after transliteration.
 * @returns The slug.
 */
function slugifyText(
    value: string,
    locale: LocaleArgument | undefined,
    separator: string,
    lowerCase: boolean,
): string {
    const transliterated = transliterateText(value, locale);
    const cased = lowerCase
        ? lowercase(transliterated, locale)
        : transliterated;
    const runs: string[] = [];
    let current = "";
    for (const character of cased) {
        if (/^[\p{L}\p{N}]$/u.test(character)) {
            current += character;
            continue;
        }
        if (current.length > 0) {
            runs.push(current);
            current = "";
        }
    }
    if (current.length > 0) {
        runs.push(current);
    }
    return runs.join(separator);
}

/**
 * Lowercases `value` in `locale`.
 *
 * A missing locale uses English so Turkish `i` does not change shape
 * unless the caller asked for that locale.
 *
 * @param value - Text that has already been transliterated.
 * @param locale - The caller's locale, or `undefined`.
 * @returns The lowercased text.
 */
function lowercase(value: string, locale: LocaleArgument | undefined): string {
    if (locale === undefined) {
        return value.toLocaleLowerCase("en");
    }
    if (typeof locale === "string") {
        return value.toLocaleLowerCase(locale);
    }
    return value.toLocaleLowerCase([...locale]);
}
