import { containsHalfWidth } from "../utils/display-width.utils.js";

/**
 * Reports whether `value` contains a halfwidth character.
 *
 * Halfwidth katakana and the halfwidth forms in the FF00 block qualify.
 * Ordinary ASCII does not. A non-string returns `false`.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when a halfwidth character is present.
 * @example
 * hasHalfWidthCharacter("ｱ");
 */
export function hasHalfWidthCharacter(value: unknown): boolean {
    return typeof value === "string" && containsHalfWidth(value);
}
