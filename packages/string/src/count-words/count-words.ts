import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoWords } from "../utils/words.utils.js";
import type { CountWordsOptions } from "./count-words.types.js";

/**
 * Counts words with the same split as `splitWords`.
 *
 * An empty string returns 0. The input is not changed.
 *
 * @param value - The text to count.
 * @returns The word count, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `locale` is not a string or a list of strings.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * countWords("foo bar");
 */
export function countWords(value: string): number | undefined;
/** @param options - `value` and an optional `locale`. */
export function countWords(options: CountWordsOptions): number | undefined;
/** @param valueOrOptions - A string, or `value` plus `locale`. */
export function countWords(valueOrOptions: unknown): number | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const locale = resolved.options.locale;
    return splitIntoWords(
        resolved.value,
        locale === undefined ? {} : { locale },
    ).length;
}
