import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoWords, type WordSplitOptions } from "../utils/words.utils.js";
import { joinSentenceCase } from "../utils/case-join.utils.js";
import type { ToSentenceCaseOptions } from "./to-sentence-case.types.js";

/**
 * Converts `value` to sentence case.
 *
 * Words come from `splitWords`. The input is not changed.
 *
 * @param value - The text to convert.
 * @returns The converted string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * toSentenceCase("fooBar");
 */
export function toSentenceCase(value: string): string | undefined;
/**
 * @param options - `value` and an optional `locale`.
 * @returns The converted string, or `undefined` when `value` is not a string.
 */
export function toSentenceCase(
    options: ToSentenceCaseOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `locale`.
 * @returns The converted string, or `undefined` when `value` is not a string.
 */
export function toSentenceCase(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const wordOptions: WordSplitOptions = {};
    if (resolved.options.locale !== undefined) {
        wordOptions.locale = resolved.options.locale;
    }
    const words = splitIntoWords(resolved.value, wordOptions);
    return joinSentenceCase(words, resolved.options.locale);
}
