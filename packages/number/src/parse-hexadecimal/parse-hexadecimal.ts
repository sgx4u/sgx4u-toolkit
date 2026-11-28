import { integerFromDigits } from "../utils/base-digits.utils.js";

/**
 * Parses a hexadecimal integer, with an optional `0x` prefix.
 *
 * @example
 * parseHexadecimal("0xff");
 */
export function parseHexadecimal(value: string): number | bigint | undefined {
    return integerFromDigits(value, 16);
}
