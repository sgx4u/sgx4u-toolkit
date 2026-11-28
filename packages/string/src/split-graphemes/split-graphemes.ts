import { splitIntoUnits } from "../utils/units.utils.js";

/**
 * Splits `value` into grapheme clusters.
 *
 * Family emoji, flags, and combining marks stay together. The result is a
 * new array. The input is not changed.
 *
 * @param value - The text to split.
 * @returns The graphemes, or `undefined` when `value` is not a string.
 * @example
 * splitGraphemes("a😀");
 */
export function splitGraphemes(value: unknown): string[] | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return splitIntoUnits(value, "grapheme");
}
