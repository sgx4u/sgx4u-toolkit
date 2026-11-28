import { integerFromDigits } from "../utils/base-digits.utils.js";

/**
 * Parses an octal integer, with an optional `0o` prefix.
 *
 * @example
 * parseOctal("0o10");
 */
export function parseOctal(value: string): number | bigint | undefined {
    return integerFromDigits(value, 8);
}
