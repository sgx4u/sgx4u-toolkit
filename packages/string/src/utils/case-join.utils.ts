import type { CaseName } from "../types/case-name.types.js";
import type { TitleCaseStyle } from "../types/string-unit.types.js";
import {
    chicagoSmallWords,
    apaSmallWords,
} from "../data/title-case-small-words.data.js";
import type { LocaleArgument } from "./locale.utils.js";
import { localeForIntl } from "./locale.utils.js";
import { splitIntoUnits } from "./units.utils.js";

const upperLetterExpression = /\p{Lu}|\p{Lt}/u;
const lowerLetterExpression = /\p{Ll}/u;

/**
 * How a case pattern writes each word and what it puts between words.
 */
interface CasePattern {
    /** Separator between words. An empty string concatenates them. */
    separator: string;
    /** Casing applied to every word before the first-word exception. */
    wordCase: "lower" | "capital" | "upper";
    /** Casing of the first word when it differs from the rest. */
    firstWordCase?: "lower" | "capital";
    /** When `true`, an all-uppercase word of at least two letters stays uppercase. */
    preserveAcronym?: boolean;
}

const casePatterns: Record<
    Exclude<CaseName, "title" | "sentence">,
    CasePattern
> = {
    camel: {
        separator: "",
        wordCase: "capital",
        firstWordCase: "lower",
        preserveAcronym: true,
    },
    pascal: { separator: "", wordCase: "capital", preserveAcronym: true },
    snake: { separator: "_", wordCase: "lower" },
    kebab: { separator: "-", wordCase: "lower" },
    constant: { separator: "_", wordCase: "upper" },
    dot: { separator: ".", wordCase: "lower" },
    path: { separator: "/", wordCase: "lower" },
    train: { separator: "-", wordCase: "capital", preserveAcronym: true },
    "pascal-snake": {
        separator: "_",
        wordCase: "capital",
        preserveAcronym: true,
    },
    capital: { separator: " ", wordCase: "capital" },
    "no-case": { separator: " ", wordCase: "lower" },
    lower: { separator: " ", wordCase: "lower" },
    upper: { separator: " ", wordCase: "upper" },
};

/**
 * Whether `word` is an acronym that can stay in uppercase.
 *
 * An acronym has at least two uppercase letters and no lowercase letter.
 * `ID` and `XML` qualify. `Http` does not.
 *
 * @param word - One word from the splitter, in its original case.
 * @returns `true` when the word should keep its uppercase letters.
 */
function isAcronym(word: string): boolean {
    let uppercaseCount = 0;
    for (const character of word) {
        if (lowerLetterExpression.test(character)) {
            return false;
        }
        if (upperLetterExpression.test(character)) {
            uppercaseCount += 1;
        }
    }
    return uppercaseCount >= 2;
}

/**
 * Writes one word in `wordCase`.
 *
 * @param word - The original word.
 * @param wordCase - Lower, capital, or upper.
 * @param locale - Locale passed to the casing methods.
 * @param preserveAcronym - When `true` and the word is an acronym, keep it uppercase.
 * @returns The cased word.
 */
function writeWord(
    word: string,
    wordCase: "lower" | "capital" | "upper",
    locale: LocaleArgument | undefined,
    preserveAcronym: boolean,
): string {
    const locales = localeForIntl(locale);
    if (preserveAcronym && isAcronym(word)) {
        return word.toLocaleUpperCase(locales);
    }
    const lower = word.toLocaleLowerCase(locales);
    if (wordCase === "lower") {
        return lower;
    }
    if (wordCase === "upper") {
        return lower.toLocaleUpperCase(locales);
    }
    const graphemes = splitIntoUnits(lower, "grapheme", locale);
    const first = graphemes[0];
    if (first === undefined) {
        return lower;
    }
    return first.toLocaleUpperCase(locales) + graphemes.slice(1).join("");
}

/**
 * Joins words in a programming case.
 *
 * `keepConsecutiveUppercase` only changes camel, pascal, train, and
 * pascal-snake. The other patterns lowercase or uppercase every letter,
 * so an acronym cannot stay mixed. The input words are not changed.
 *
 * @param words - Words from `splitIntoWords`.
 * @param caseName - The case to write. `"title"` and `"sentence"` are handled elsewhere.
 * @param locale - Locale for casing.
 * @param keepConsecutiveUppercase - When `true`, acronyms stay uppercase in the patterns that preserve case.
 * @returns The joined string. An empty word list returns an empty string.
 */
export function joinCaseWords(
    words: readonly string[],
    caseName: Exclude<CaseName, "title" | "sentence">,
    locale: LocaleArgument | undefined,
    keepConsecutiveUppercase: boolean,
): string {
    const pattern = casePatterns[caseName];
    const preserveAcronym =
        keepConsecutiveUppercase && pattern.preserveAcronym === true;
    return words
        .map((word, index) => {
            const wordCase =
                index === 0 && pattern.firstWordCase !== undefined
                    ? pattern.firstWordCase
                    : pattern.wordCase;
            if (index === 0 && wordCase === "lower") {
                return word.toLocaleLowerCase(localeForIntl(locale));
            }
            return writeWord(word, wordCase, locale, preserveAcronym);
        })
        .join(pattern.separator);
}

/**
 * Joins words as a sentence: first grapheme upper, the rest lower, spaces between words.
 *
 * @param words - Words from `splitIntoWords`.
 * @param locale - Locale for casing.
 * @returns The sentence. An empty word list returns an empty string.
 */
export function joinSentenceCase(
    words: readonly string[],
    locale: LocaleArgument | undefined,
): string {
    const locales = localeForIntl(locale);
    const lower = words
        .map((word) => word.toLocaleLowerCase(locales))
        .join(" ");
    const graphemes = splitIntoUnits(lower, "grapheme", locale);
    const first = graphemes[0];
    if (first === undefined) {
        return lower;
    }
    return first.toLocaleUpperCase(locales) + graphemes.slice(1).join("");
}

/**
 * Small words for a title-case style.
 *
 * @param style - The title-case style.
 * @returns The default small-word list. `"capitalize-every-word"` has none.
 */
export function smallWordsForStyle(style: TitleCaseStyle): readonly string[] {
    if (style === "apa") {
        return apaSmallWords;
    }
    if (style === "chicago") {
        return chicagoSmallWords;
    }
    return [];
}

/**
 * Joins words in title case.
 *
 * Small words stay lowercase unless they are the first or last word.
 * Comparison uses the locale. The caller can replace the list.
 *
 * @param words - Words from `splitIntoWords`.
 * @param locale - Locale for casing and for the small-word comparison.
 * @param style - Which default list to use when `smallWords` is omitted.
 * @param smallWords - Caller list. Compared after lowercasing.
 * @returns The title. An empty word list returns an empty string.
 */
export function joinTitleCase(
    words: readonly string[],
    locale: LocaleArgument | undefined,
    style: TitleCaseStyle,
    smallWords: readonly string[] | undefined,
): string {
    const locales = localeForIntl(locale);
    const list = smallWords ?? smallWordsForStyle(style);
    const smallWordSet = new Set(
        list.map((word) => word.toLocaleLowerCase(locales)),
    );
    return words
        .map((word, index) => {
            const lower = word.toLocaleLowerCase(locales);
            const isEdge = index === 0 || index === words.length - 1;
            if (!isEdge && smallWordSet.has(lower)) {
                return lower;
            }
            return writeWord(word, "capital", locale, false);
        })
        .join(" ");
}
