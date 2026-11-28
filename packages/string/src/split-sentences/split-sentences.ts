import { getSegmenter } from "../utils/intl-cache.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { SplitSentencesOptions } from "./split-sentences.types.js";

/**
 * Splits `value` into sentences with `Intl.Segmenter` and trims each one.
 *
 * Empty segments are dropped. The result is a new array. The input is not changed.
 *
 * @param value - The text to split.
 * @returns The sentences, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `locale` is empty.
 * @example
 * splitSentences("Hello. World.");
 */
export function splitSentences(value: string): string[] | undefined;
/** @param options - `value` and an optional `locale`. */
export function splitSentences(
    options: SplitSentencesOptions,
): string[] | undefined;
/** @param valueOrOptions - A string, or `value` plus `locale`. */
export function splitSentences(valueOrOptions: unknown): string[] | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined) return undefined;
    const sentences: string[] = [];
    for (const segment of getSegmenter(
        "sentence",
        resolved.options.locale,
    ).segment(resolved.value)) {
        const trimmed = segment.segment.trim();
        if (trimmed.length > 0) sentences.push(trimmed);
    }
    return sentences;
}
