import { stripDiacritics } from "../utils/diacritics.utils.js";

/**
 * Removes diacritics and maps a few Latin letters to ASCII.
 *
 * `Å` becomes `A` and `ß` becomes `ss`. Combining marks are removed, so
 * Hindi vowel signs do not survive, while Hindi and CJK base letters do.
 * The input is not changed.
 *
 * @param value - Text that may contain accents. A non-string returns `undefined`.
 * @returns The text without combining marks, or `undefined` when `value` is not a string.
 * @example
 * removeDiacritics("Café");
 */
export function removeDiacritics(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return stripDiacritics(value);
}
