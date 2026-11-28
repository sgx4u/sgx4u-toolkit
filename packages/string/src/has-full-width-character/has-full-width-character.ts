import { containsFullWidth } from "../utils/display-width.utils.js";

/**
 * Reports whether `value` contains a wide or fullwidth character.
 *
 * Emoji presentation counts, because that grapheme occupies two columns.
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when a two-column grapheme is present.
 * @example
 * hasFullWidthCharacter("あ");
 */
export function hasFullWidthCharacter(value: unknown): boolean {
    return typeof value === "string" && containsFullWidth(value);
}
