import { decodeBase64Bytes, decodeUtf8 } from "../utils/encoding.utils.js";

/**
 * Decodes URL-safe Base64 to a string.
 *
 * The alphabet uses `-` and `_`. Padding is rejected. A bad alphabet or a
 * result that is not UTF-8 returns `undefined`. The function does not
 * throw for those inputs. A non-string returns `undefined`. The input is
 * not changed.
 *
 * @param value - Any value. Only a string is decoded.
 * @returns The decoded text, or `undefined` when `value` is not valid URL-safe Base64.
 * @example
 * decodeBase64URL("aGk");
 */
export function decodeBase64URL(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const bytes = decodeBase64Bytes(value, true);
    if (bytes === undefined) {
        return undefined;
    }
    return decodeUtf8(bytes);
}
