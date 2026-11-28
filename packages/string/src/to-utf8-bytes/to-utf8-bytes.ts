import { encodeUtf8 } from "../utils/encoding.utils.js";

/**
 * Encodes `value` as UTF-8 bytes.
 *
 * A non-string returns `undefined`. The input is not changed. The result
 * is a new `Uint8Array`.
 *
 * @param value - Any value. Only a string is encoded.
 * @returns The bytes, or `undefined` when `value` is not a string.
 * @example
 * toUTF8Bytes("hi");
 */
export function toUTF8Bytes(value: unknown): Uint8Array | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return encodeUtf8(value);
}
