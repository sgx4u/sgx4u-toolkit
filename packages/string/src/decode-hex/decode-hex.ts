import { decodeHexString } from "../utils/encoding.utils.js";

/**
 * Decodes hexadecimal text to a string.
 *
 * Digits may be uppercase or lowercase. An odd length, a non-hex digit, or
 * bytes that are not UTF-8 return `undefined`. The function does not throw
 * for those inputs. A non-string returns `undefined`. The input is not
 * changed.
 *
 * @param value - Any value. Only a string is decoded.
 * @returns The decoded text, or `undefined` when `value` is not valid hex.
 * @example
 * decodeHex("41");
 */
export function decodeHex(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return decodeHexString(value);
}
