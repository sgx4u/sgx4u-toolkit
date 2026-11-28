import { encodeBase64Bytes, encodeUtf8 } from "../utils/encoding.utils.js";

/**
 * Encodes `value` as URL-safe Base64 without padding.
 *
 * The text is encoded as UTF-8 first. The alphabet uses `-` and `_`.
 * A non-string returns `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a string is encoded.
 * @returns The URL-safe Base64 text, or `undefined` when `value` is not a string.
 * @example
 * encodeBase64URL("hi");
 */
export function encodeBase64URL(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return encodeBase64Bytes(encodeUtf8(value), true);
}
