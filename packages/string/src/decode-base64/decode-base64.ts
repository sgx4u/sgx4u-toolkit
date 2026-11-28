import { decodeBase64Bytes, decodeUtf8 } from "../utils/encoding.utils.js";

/**
 * Decodes standard Base64 to a string.
 *
 * Padding may be omitted. A bad alphabet, bad padding, or a result that
 * is not UTF-8 returns `undefined`. The function does not throw for those
 * inputs. A non-string returns `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a string is decoded.
 * @returns The decoded text, or `undefined` when `value` is not valid Base64 text.
 * @example
 * decodeBase64("aGk=");
 */
export function decodeBase64(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const bytes = decodeBase64Bytes(value, false);
    if (bytes === undefined) {
        return undefined;
    }
    return decodeUtf8(bytes);
}
