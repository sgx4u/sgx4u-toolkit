import { encodeHexString } from "../utils/encoding.utils.js";

/**
 * Encodes `value` as lowercase hexadecimal.
 *
 * The text is encoded as UTF-8 first. Each byte becomes two digits. A
 * non-string returns `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a string is encoded.
 * @returns The hex text, or `undefined` when `value` is not a string.
 * @example
 * encodeHex("A");
 */
export function encodeHex(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return encodeHexString(value);
}
