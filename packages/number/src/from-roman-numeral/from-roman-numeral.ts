import { integerFromRoman } from "../utils/roman-numeral.utils.js";

/**
 * Parses a case-insensitive Roman numeral. Standard subtractive forms are accepted. Empty text and invalid sequences such as `IIX` return `undefined`. The extended parenthetical form is accepted.
 *
 * @example
 * fromRomanNumeral("IV");
 */
export function fromRomanNumeral(value: string): number | undefined {
    return integerFromRoman(value);
}
