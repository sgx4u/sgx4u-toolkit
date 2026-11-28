import { splitSentences } from "../split-sentences/split-sentences.js";

/**
 * Counts sentences with the same split as `splitSentences`.
 *
 * The input is not changed.
 *
 * @param value - The text to count.
 * @returns The sentence count, or `undefined` when `value` is not a string.
 * @example
 * countSentences("Hello. World.");
 */
export function countSentences(value: string): number | undefined;
/** @param options - `value` and an optional `locale`. */
export function countSentences(options: {
    value: string;
    locale?: string;
}): number | undefined;
/** @param valueOrOptions - A string, or `value` plus `locale`. */
export function countSentences(valueOrOptions: unknown): number | undefined {
    const sentences = splitSentences(valueOrOptions as string);
    return sentences === undefined ? undefined : sentences.length;
}
