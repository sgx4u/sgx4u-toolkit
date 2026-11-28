import { integerFromDigits } from "../utils/base-digits.utils.js";

/**
 * Parses a binary integer, with an optional `0b` prefix.
 *
 * @example
 * parseBinary("0b1010");
 */
export function parseBinary(value: string): number | bigint | undefined {
    return integerFromDigits(value, 2);
}
