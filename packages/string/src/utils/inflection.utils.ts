import {
    aBeforeWords,
    anBeforeWords,
    irregularPlurals,
    uncountableWords,
} from "../data/inflection.data.js";
import { readFiniteNumber, readInteger } from "./assertions.utils.js";
import { getNumberFormat } from "./intl-cache.utils.js";
import { readLocale, type LocaleArgument } from "./locale.utils.js";
import { splitIntoUnits } from "./units.utils.js";

const uncountableSet = new Set(uncountableWords);
const pluralToSingular = new Map(
    Object.entries(irregularPlurals).map(([singular, plural]) => [
        plural,
        singular,
    ]),
);
const anBeforeSet = new Set(anBeforeWords);
const aBeforeSet = new Set(aBeforeWords);
const sibilantExpression = /(?:s|x|z|ch|sh)$/u;
const consonantYExpression = /[^aeiou]y$/u;

/**
 * Singular nouns whose trailing s must not be stripped.
 *
 * `bus` would otherwise look like the plural of `bu`.
 */
const singularsEndingInS: ReadonlySet<string> = new Set([
    "bus",
    "gas",
    "plus",
    "lens",
    "alias",
    "bias",
    "canvas",
    "analysis",
    "basis",
    "crisis",
    "thesis",
]);

/**
 * Whether `locale` is an English tag this package can inflect.
 *
 * `en` and regional English tags are accepted. Anything else is rejected
 * so a caller does not silently receive English morphology.
 *
 * @param locale - A locale already checked by `readLocale`, or `undefined` for the English default.
 * @returns Nothing.
 * @throws {@link RangeError} When the locale is not English.
 */
export function assertEnglishLocale(locale: LocaleArgument | undefined): void {
    const tag = (
        typeof locale === "string" ? locale : (locale?.[0] ?? "en")
    ).toLocaleLowerCase("en");
    if (tag !== "en" && !tag.startsWith("en-")) {
        throw new RangeError(
            `locale must be an English language tag. Received ${JSON.stringify(typeof locale === "string" ? locale : tag)}.`,
        );
    }
}

/**
 * Reads the inflection locale and requires English.
 *
 * @param value - The option value. Omitted means `en`.
 * @returns The locale passed to casing.
 */
export function readEnglishLocale(value: unknown): LocaleArgument {
    const locale = value === undefined ? "en" : readLocale(value);
    const resolved = locale ?? "en";
    assertEnglishLocale(resolved);
    return resolved;
}

/**
 * Copies the casing of `original` onto `replacement`.
 *
 * @param original - The word the caller passed.
 * @param replacement - The lowercase dictionary form.
 * @returns `replacement` cased like `original`.
 */
function matchCase(original: string, replacement: string): string {
    if (
        original === original.toLocaleUpperCase("en") &&
        /[A-Z]/u.test(original)
    ) {
        return replacement.toLocaleUpperCase("en");
    }
    const first = original.codePointAt(0);
    if (
        first !== undefined &&
        String.fromCodePoint(first) !==
            String.fromCodePoint(first).toLocaleLowerCase("en")
    ) {
        const graphemes = [...replacement];
        const head = graphemes[0];
        if (head === undefined) {
            return replacement;
        }
        return head.toLocaleUpperCase("en") + graphemes.slice(1).join("");
    }
    return replacement;
}

/**
 * Lowercase singular form, or the word itself when it is already singular.
 *
 * @param word - One English word, any case.
 * @returns The lowercase singular.
 */
function toSingularLower(word: string): string {
    const lower = word.toLocaleLowerCase("en");
    if (uncountableSet.has(lower) || singularsEndingInS.has(lower)) {
        return lower;
    }
    const irregular = pluralToSingular.get(lower);
    if (irregular !== undefined) {
        return irregular;
    }
    if (Object.hasOwn(irregularPlurals, lower)) {
        return lower;
    }
    if (
        lower.endsWith("ies") &&
        lower.length > 4 &&
        consonantYExpression.test(`${lower.slice(0, -3)}y`)
    ) {
        const candidate = `${lower.slice(0, -3)}y`;
        if (toPluralLower(candidate) === lower) {
            return candidate;
        }
    }
    if (lower.endsWith("es") && lower.length > 3) {
        const stem = lower.slice(0, -2);
        if (sibilantExpression.test(stem) && toPluralLower(stem) === lower) {
            return stem;
        }
    }
    if (lower.endsWith("s") && !lower.endsWith("ss") && lower.length > 3) {
        const stem = lower.slice(0, -1);
        if (stem.length >= 3 && toPluralLower(stem) === lower) {
            return stem;
        }
    }
    return lower;
}

/**
 * Lowercase plural form of a singular word.
 *
 * @param singular - A lowercase singular word.
 * @returns The lowercase plural.
 */
function toPluralLower(singular: string): string {
    if (uncountableSet.has(singular)) {
        return singular;
    }
    const irregular = irregularPlurals[singular];
    if (irregular !== undefined) {
        return irregular;
    }
    if (consonantYExpression.test(singular)) {
        return `${singular.slice(0, -1)}ies`;
    }
    if (sibilantExpression.test(singular)) {
        return `${singular}es`;
    }
    return `${singular}s`;
}

/**
 * The singular form of `word`, keeping the caller's casing.
 *
 * @param word - An English noun.
 * @returns The singular form.
 */
export function singularForm(word: string): string {
    return matchCase(word, toSingularLower(word));
}

/**
 * The plural form of `word`, keeping the caller's casing.
 *
 * The word is reduced to a singular first, so a plural input is not
 * pluralized twice.
 *
 * @param word - An English noun.
 * @returns The plural form.
 */
export function pluralForm(word: string): string {
    return matchCase(word, toPluralLower(toSingularLower(word)));
}

/**
 * Whether the lowercase word is uncountable.
 *
 * @param word - Any case.
 * @returns `true` for words such as `sheep` and `news`.
 */
export function isUncountable(word: string): boolean {
    return uncountableSet.has(word.toLocaleLowerCase("en"));
}

/**
 * English ordinal suffix for an integer, including the number.
 *
 * @param count - A finite integer. Negative numbers keep the sign.
 * @returns Text such as `1st`, `2nd`, `11th`.
 */
export function englishOrdinal(count: number): string {
    const absolute = Math.abs(count);
    const lastTwo = absolute % 100;
    const last = absolute % 10;
    let suffix = "th";
    if (lastTwo < 11 || lastTwo > 13) {
        if (last === 1) {
            suffix = "st";
        } else if (last === 2) {
            suffix = "nd";
        } else if (last === 3) {
            suffix = "rd";
        }
    }
    return `${count}${suffix}`;
}

/**
 * English indefinite article for `word`.
 *
 * The choice follows pronunciation: silent `h`, a leading "you" sound,
 * digit words, and initialisms. `FBI` takes `an` because the letter name
 * starts with a vowel sound. `unicorn` takes `a`.
 *
 * @param word - The following word.
 * @returns `"a"` or `"an"`.
 */
export function englishArticle(word: string): string {
    const trimmed = word.trim();
    const lower = trimmed.toLocaleLowerCase("en");
    const letters = lower.replace(/[^a-z0-9]/gu, "");
    if (anBeforeSet.has(lower) || anBeforeSet.has(letters)) {
        return "an";
    }
    if (aBeforeSet.has(lower) || aBeforeSet.has(letters)) {
        return "a";
    }
    if (/^\d/u.test(trimmed)) {
        const spoken: Record<string, string> = {
            "8": "an",
            "11": "an",
            "18": "an",
        };
        const head = /^(11|18|8|\d+)/u.exec(trimmed)?.[1] ?? "";
        if (spoken[head] !== undefined) {
            return spoken[head];
        }
        if (head.startsWith("8")) {
            return "an";
        }
        return "a";
    }
    const initials = trimmed.split(/[\s-]+/u)[0] ?? trimmed;
    if (
        initials.length > 1 &&
        initials === initials.toLocaleUpperCase("en") &&
        /^[A-Z]+$/u.test(initials)
    ) {
        return "AEFHILMNORSX".includes(initials[0] ?? "") ? "an" : "a";
    }
    return /^[aeiou]/u.test(lower) ? "an" : "a";
}

/**
 * Reads a count for plural helpers.
 *
 * @param value - The option value.
 * @param fallback - Used when the option is omitted.
 * @returns A finite number.
 */
export function readCount(value: unknown, fallback?: number): number {
    return readFiniteNumber("count", value, fallback);
}

/**
 * Reads an integer count for ordinals.
 *
 * @param value - The option value.
 * @returns A finite integer.
 */
export function readOrdinalCount(value: unknown): number {
    return readInteger(
        "count",
        value,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
    );
}

/**
 * Formats `count` in `locale` and appends the inflected noun.
 *
 * @param word - The noun.
 * @param count - The number of things.
 * @param locale - An English locale.
 * @returns Text such as `1 apple` or `2 apples`.
 */
export function formatEnglishCount(
    word: string,
    count: number,
    locale: LocaleArgument,
): string {
    const formatted = getNumberFormat(locale).format(count);
    const noun = count === 1 ? singularForm(word) : pluralForm(word);
    return `${formatted} ${noun}`;
}

/**
 * First grapheme, used by article tests that need a stable slice.
 *
 * @param value - Any string.
 * @returns The first grapheme, or an empty string.
 */
export function firstGrapheme(value: string): string {
    return splitIntoUnits(value, "grapheme")[0] ?? "";
}
