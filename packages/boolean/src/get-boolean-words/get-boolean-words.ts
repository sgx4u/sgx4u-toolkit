import {
    defaultFalsyTokens,
    defaultTruthyTokens,
} from "../constants/default-tokens.constants.js";
import { localeWordsByLanguage } from "../data/locale-words.data.js";
import type {
    BooleanWordCategory,
    BooleanWords,
    GetBooleanWordsInput,
} from "../types/parse-options.types.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { languageSubtag } from "../utils/language-subtag.utils.js";
import { uniqueStrings } from "../utils/unique-strings.utils.js";

const booleanWordCategories = ["truthy", "falsy", "all"] as const;

/**
 * Returns a new copy of the built-in boolean vocabulary.
 *
 * English tokens come first. A known locale then appends its yes/no words,
 * skipping spellings already present. `en` therefore returns the full
 * English token lists, not only yes and no. An unknown language returns
 * the English lists alone. `category` clears the side that was not asked
 * for. The stored table is not mutated.
 *
 * @param input - Optional locale and category. Omit the argument for English and both sides.
 * @returns New `truthy` and `falsy` arrays.
 * @throws {TypeError} When `input` is not an object, `locale` is not a string, or `category` is not `"truthy"`, `"falsy"`, or `"all"`.
 * @example
 * getBooleanWords({ locale: "fr", category: "truthy" }).truthy.at(-1); // "oui"
 */
export function getBooleanWords(input?: GetBooleanWordsInput): BooleanWords {
    assertWordInput(input);
    const locale = readWordLocale(input?.locale);
    const category = readCategory(input?.category);
    const words = wordsForLocale(locale);
    if (category === "truthy") {
        return { truthy: words.truthy, falsy: [] };
    }
    if (category === "falsy") {
        return { truthy: [], falsy: words.falsy };
    }
    return words;
}

/**
 * @param input - The argument, or `undefined` when the caller passed nothing.
 * @throws {TypeError} When `input` is not a non-array object.
 */
function assertWordInput(
    input: GetBooleanWordsInput | undefined,
): asserts input is GetBooleanWordsInput | undefined {
    if (input === undefined) {
        return;
    }
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
        throw new TypeError(
            `getBooleanWords requires an object. Received ${describeReceived(input)}.`,
        );
    }
}

/**
 * @param locale - The provided locale, or `undefined` when omitted.
 * @returns `"en"` when omitted.
 * @throws {TypeError} When `locale` is not a string.
 */
function readWordLocale(locale: unknown): string {
    if (locale === undefined) {
        return "en";
    }
    if (typeof locale !== "string") {
        throw new TypeError(
            `locale must be a string. Received ${describeReceived(locale)}.`,
        );
    }
    return locale;
}

/**
 * @param category - The provided category, or `undefined` when omitted.
 * @returns `"all"` when omitted.
 * @throws {TypeError} When `category` is not a known value.
 */
function readCategory(category: unknown): BooleanWordCategory {
    if (category === undefined) {
        return "all";
    }
    if (category === "truthy" || category === "falsy" || category === "all") {
        return category;
    }
    throw new TypeError(
        `category must be one of ${booleanWordCategories
            .map((name) => JSON.stringify(name))
            .join(", ")}. Received ${describeReceived(category)}.`,
    );
}

/**
 * @param locale - A BCP 47 tag. The language subtag is looked up.
 * @returns New arrays. English tokens come before locale yes/no words.
 */
function wordsForLocale(locale: string): BooleanWords {
    const entry = localeWordsByLanguage[languageSubtag(locale)];
    return {
        truthy: uniqueStrings([
            ...defaultTruthyTokens,
            ...(entry?.truthy ?? []),
        ]),
        falsy: uniqueStrings([...defaultFalsyTokens, ...(entry?.falsy ?? [])]),
    };
}
