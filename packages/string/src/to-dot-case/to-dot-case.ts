import type { CaseConversionOptions } from "../types/case-conversion.types.js";
import { readBoolean } from "../utils/assertions.utils.js";
import { joinCaseWords } from "../utils/case-join.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoWords, type WordSplitOptions } from "../utils/words.utils.js";

/**
 * Converts `value` to dot case (`foo.bar`).
 *
 * Words come from `splitWords`. Separators are removed. The input is not
 * changed. An empty string stays empty.
 *
 * When `keepConsecutiveUppercase` is false, `XMLHttpRequest` becomes a
 * normal capitalisation of each word. When it is true, an acronym such as
 * `XML` or `ID` stays in uppercase in camel, pascal, train, and
 * pascal-snake. Snake, kebab, and constant case lowercase or uppercase
 * every letter, so the flag does not change them.
 *
 * When `mergeAmbiguousCharacters` is false, `v1.2` is `v`, `1`, `2`.
 * When it is true, `V1.2` becomes `v12` in camel case.
 *
 * @param value - The text to convert.
 * @returns The converted string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `locale` is an empty string.
 * @example
 * toDotCase("foo bar");
 */
export function toDotCase(value: string): string | undefined;
/**
 * @param options - `value` plus locale and split flags.
 * @returns The converted string, or `undefined` when `value` is not a string.
 */
export function toDotCase(options: CaseConversionOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The converted string, or `undefined` when `value` is not a string.
 */
export function toDotCase(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
        keepConsecutiveUppercase: readBoolean(
            "keepConsecutiveUppercase",
            record.keepConsecutiveUppercase,
            false,
        ),
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
    const words = splitIntoWords(resolved.value, wordOptions);
    return joinCaseWords(
        words,
        "dot",
        resolved.options.locale,
        resolved.options.keepConsecutiveUppercase,
    );
}
