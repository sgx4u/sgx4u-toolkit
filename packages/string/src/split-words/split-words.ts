import { readBoolean } from "../utils/assertions.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoWords, type WordSplitOptions } from "../utils/words.utils.js";
import type { SplitWordsOptions } from "./split-words.types.js";

/**
 * Splits `value` into words for case conversion.
 *
 * Separators are Unicode punctuation and whitespace. A lowercase letter
 * followed by an uppercase letter starts a word. An uppercase run stays
 * together except the last capital that starts a lowercase word, so
 * `XMLHttpRequest` is `XML`, `Http`, `Request`. Emoji are their own words.
 * A run of letters with no case, including CJK, is one word. An empty
 * string returns an empty array. The input is not changed.
 *
 * When `mergeAmbiguousCharacters` is false, `v1.2` is `v`, `1`, `2`.
 * When it is true, `V1.2` is `V12` and `version2Beta` is `version2`, `Beta`.
 *
 * @param value - The text to split.
 * @returns The words, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * splitWords("fooBar");
 */
export function splitWords(value: string): string[] | undefined;
/**
 * @param options - `value`, `locale`, and `mergeAmbiguousCharacters`.
 * @returns The words, or `undefined` when `value` is not a string.
 */
export function splitWords(options: SplitWordsOptions): string[] | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The words, or `undefined` when `value` is not a string.
 */
export function splitWords(valueOrOptions: unknown): string[] | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
        mergeAmbiguousCharacters: readBoolean(
            "mergeAmbiguousCharacters",
            record.mergeAmbiguousCharacters,
            false,
        ),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const wordOptions: WordSplitOptions = {
        mergeAmbiguousCharacters: resolved.options.mergeAmbiguousCharacters,
    };
    if (resolved.options.locale !== undefined) {
        wordOptions.locale = resolved.options.locale;
    }
    return splitIntoWords(resolved.value, wordOptions);
}
