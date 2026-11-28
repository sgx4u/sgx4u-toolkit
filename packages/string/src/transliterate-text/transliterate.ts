import {
    germanTransliteration,
    transliterationByCharacter,
} from "../data/transliteration.data.js";
import type { LocaleArgument } from "../utils/locale.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { TransliterateOptions } from "./transliterate.types.js";

export type { TransliterateOptions } from "./transliterate.types.js";

/**
 * Maps `value` to Latin letters.
 *
 * Latin, Greek, Cyrillic, Arabic, Hebrew, and a compact Devanagari set are
 * mapped. A German locale (`de`) maps `ä` to `ae`, `ö` to `oe`, `ü` to
 * `ue`, and `ß` to `ss` before that table, so the umlaut is not reduced to
 * a single vowel. Other combining marks are dropped. Unmapped characters
 * stay in place. A non-string returns `undefined`. The input is not changed.
 *
 * @param value - The text to map.
 * @returns The mapped text, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `locale` is present and is not a string or a list of strings.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * transliterate({ value: "Äpfel", locale: "de" });
 */
export function transliterate(value: string): string | undefined;
/**
 * @param options - `value` and an optional `locale`.
 * @returns The mapped text, or `undefined` when `value` is not a string.
 */
export function transliterate(
    options: TransliterateOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @returns The mapped text, or `undefined` when `value` is not a string.
 */
export function transliterate(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return transliterateText(resolved.value, resolved.options.locale);
}

/**
 * Maps `value` with an already-checked locale.
 *
 * @param value - The text to map.
 * @param locale - A locale already read by `readLocale`, or `undefined`.
 * @returns The mapped text.
 */
export function transliterateText(
    value: string,
    locale: LocaleArgument | undefined,
): string {
    const german = usesGerman(locale);
    let mapped = "";
    for (const character of value) {
        mapped += mapCharacter(character, german);
    }
    return mapped;
}

/**
 * Whether `locale` asks for German orthography.
 *
 * @param locale - A locale, a list of locales, or `undefined`.
 * @returns `true` when any tag has the language `de`.
 */
function usesGerman(locale: LocaleArgument | undefined): boolean {
    if (locale === undefined) {
        return false;
    }
    const tags = typeof locale === "string" ? [locale] : locale;
    for (const tag of tags) {
        try {
            if (new Intl.Locale(tag).language === "de") {
                return true;
            }
        } catch {
            const lower = tag.toLocaleLowerCase("en");
            if (lower === "de" || lower.startsWith("de-")) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Maps one character.
 *
 * German overrides win. The script map is next. A character that still
 * has combining marks is decomposed and mapped again.
 *
 * @param character - One code point.
 * @param german - Whether German umlaut spelling is in force.
 * @returns The replacement, which may be empty or several characters.
 */
function mapCharacter(character: string, german: boolean): string {
    if (german) {
        const special = germanTransliteration[character];
        if (special !== undefined) {
            return special;
        }
    }
    const direct = transliterationByCharacter[character];
    if (direct !== undefined) {
        return direct;
    }
    const decomposed = character.normalize("NFD");
    if (decomposed === character) {
        return character;
    }
    let mapped = "";
    for (const piece of decomposed) {
        if (/\p{M}/u.test(piece)) {
            continue;
        }
        mapped += transliterationByCharacter[piece] ?? piece;
    }
    return mapped;
}
