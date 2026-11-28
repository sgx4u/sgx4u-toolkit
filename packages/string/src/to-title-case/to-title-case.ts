import { readEnum } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { joinTitleCase } from "../utils/case-join.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoWords, type WordSplitOptions } from "../utils/words.utils.js";
import type { ToTitleCaseOptions } from "./to-title-case.types.js";

const styles = ["capitalize-every-word", "apa", "chicago"] as const;

/**
 * Converts `value` to title case.
 *
 * `"capitalize-every-word"` capitalizes every word. `"apa"` and `"chicago"`
 * keep a small-word list lowercase unless the word is first or last.
 * Comparison is case-insensitive in `locale`. The input is not changed.
 *
 * @param value - The text to convert.
 * @returns The title, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `style` is unknown or `locale` is empty.
 * @example
 * toTitleCase("the lord of the rings");
 */
export function toTitleCase(value: string): string | undefined;
/**
 * @param options - `value`, `locale`, `style`, and `smallWords`.
 * @returns The title, or `undefined` when `value` is not a string.
 */
export function toTitleCase(options: ToTitleCaseOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The title, or `undefined` when `value` is not a string.
 */
export function toTitleCase(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => {
        const smallWords = record.smallWords;
        if (
            smallWords !== undefined &&
            (!Array.isArray(smallWords) ||
                smallWords.some((word) => typeof word !== "string"))
        ) {
            throw new TypeError(
                `smallWords must be an array of strings. Received ${describeReceived(
                    Array.isArray(smallWords)
                        ? smallWords.find((word) => typeof word !== "string")
                        : smallWords,
                )}.`,
            );
        }
        return {
            locale: readLocale(record.locale),
            style: readEnum(
                "style",
                record.style,
                styles,
                "capitalize-every-word",
            ),
            smallWords: smallWords as readonly string[] | undefined,
        };
    });
    if (resolved === undefined) {
        return undefined;
    }
    const wordOptions: WordSplitOptions = {};
    if (resolved.options.locale !== undefined) {
        wordOptions.locale = resolved.options.locale;
    }
    const words = splitIntoWords(resolved.value, wordOptions);
    return joinTitleCase(
        words,
        resolved.options.locale,
        resolved.options.style,
        resolved.options.smallWords,
    );
}
