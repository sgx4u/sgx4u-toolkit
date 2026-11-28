import type { ReadingTime } from "../types/string-unit.types.js";
import { readFiniteNumber } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoWords } from "../utils/words.utils.js";
import type { GetReadingTimeOptions } from "./get-reading-time.types.js";

export type { GetReadingTimeOptions } from "./get-reading-time.types.js";
export type { ReadingTime } from "../types/string-unit.types.js";

/**
 * Estimates how long `value` takes to read.
 *
 * `words` comes from the same split as `splitIntoWords`. `minutes` is
 * `words / wordsPerMinute` and may be fractional. The default pace is 200
 * words per minute. A non-string returns `undefined`. The input is not
 * changed.
 *
 * @param value - The text to measure.
 * @returns The estimate, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `wordsPerMinute` is present and is not a number.
 * @throws {@link RangeError} When `wordsPerMinute` is not finite or is not greater than 0.
 * @example
 * getReadingTime("one two");
 */
export function getReadingTime(value: string): ReadingTime | undefined;
/**
 * @param options - `value` and optional `wordsPerMinute`.
 * @returns The estimate, or `undefined` when `value` is not a string.
 */
export function getReadingTime(
    options: GetReadingTimeOptions,
): ReadingTime | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `wordsPerMinute`.
 * @returns The estimate, or `undefined` when `value` is not a string.
 */
export function getReadingTime(
    valueOrOptions: unknown,
): ReadingTime | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => {
        const wordsPerMinute = readFiniteNumber(
            "wordsPerMinute",
            record.wordsPerMinute,
            200,
        );
        if (wordsPerMinute <= 0) {
            throw new RangeError(
                `wordsPerMinute must be greater than 0. Received ${describeReceived(wordsPerMinute)}.`,
            );
        }
        return { wordsPerMinute };
    });
    if (resolved === undefined) {
        return undefined;
    }
    const words = splitIntoWords(resolved.value).length;
    return {
        words,
        minutes: words / resolved.options.wordsPerMinute,
    };
}
