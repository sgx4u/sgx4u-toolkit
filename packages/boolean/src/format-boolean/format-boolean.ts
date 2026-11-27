import { englishStyleWords } from "../constants/format-styles.constants.js";
import { localeWordsByLanguage } from "../data/locale-words.data.js";
import type {
    BooleanCapitalization,
    BooleanFormatStyle,
    FormatBooleanInput,
} from "../types/format-options.types.js";
import { resolveFormatOptions } from "../utils/assert-format-options.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { languageSubtag } from "../utils/language-subtag.utils.js";

/**
 * Turns a primitive boolean into a word.
 *
 * `value` must already be a boolean. Strings are not parsed. `null` and
 * other values return `undefined`. `yes-no` and `y-n` use the locale's
 * primary yes/no word when that language is known and is not English. For
 * `y-n` outside English that primary word is used in full. The other styles
 * ignore `locale` when choosing the word. Capitalization still uses
 * `toLocaleUpperCase(locale)`. `"1-0"` has no letters, so capitalization
 * leaves it unchanged. The call takes one flat object.
 *
 * @param input - `value` plus optional style, locale, and capitalization.
 * @returns The formatted word, or `undefined` when `value` is not a primitive boolean.
 * @throws {TypeError} When `input` is not an object, `style` or `capitalization` is not a known value, or `locale` is not a string.
 * @example
 * formatBoolean({ value: true, style: "yes-no", capitalization: "sentence" }); // "Yes"
 */
export function formatBoolean(input: FormatBooleanInput): string | undefined {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
        throw new TypeError(
            `formatBoolean requires an object with value. Received ${describeReceived(input)}.`,
        );
    }
    const resolved = resolveFormatOptions(
        input.style,
        input.locale,
        input.capitalization,
    );
    if (typeof input.value !== "boolean") {
        return undefined;
    }
    const [truthyWord, falsyWord] = wordsForStyle(
        resolved.style,
        resolved.locale,
    );
    const word = input.value ? truthyWord : falsyWord;
    return applyCapitalization(word, resolved.capitalization, resolved.locale);
}

/**
 * Selects the lowercase spelling before capitalization.
 *
 * @param style - A known style.
 * @param locale - BCP 47 tag. Unknown languages keep the English spelling.
 * @returns The truthy word and the falsy word.
 */
function wordsForStyle(
    style: BooleanFormatStyle,
    locale: string,
): readonly [string, string] {
    if (style === "yes-no" || style === "y-n") {
        const language = languageSubtag(locale);
        if (language !== "en") {
            const entry = localeWordsByLanguage[language];
            const truthyWord = entry?.truthy[0];
            const falsyWord = entry?.falsy[0];
            if (truthyWord !== undefined && falsyWord !== undefined) {
                return [truthyWord, falsyWord];
            }
        }
    }
    return englishStyleWords[style];
}

/**
 * Applies `capitalization` without lowercasing a script that has no case.
 *
 * @param word - The spelling from the style table or the locale table.
 * @param capitalization - `lower`, `sentence`, or `upper`.
 * @param locale - Passed to `toLocaleUpperCase`.
 * @returns The word to return.
 */
function applyCapitalization(
    word: string,
    capitalization: BooleanCapitalization,
    locale: string,
): string {
    if (capitalization === "lower") {
        return word;
    }
    if (capitalization === "upper") {
        return word.toLocaleUpperCase(locale);
    }
    const characters = Array.from(word);
    const firstCharacter = characters[0];
    if (firstCharacter === undefined) {
        return word;
    }
    characters[0] = firstCharacter.toLocaleUpperCase(locale);
    return characters.join("");
}
