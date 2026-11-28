import { decodeUtf8 } from "../utils/encoding.utils.js";

/**
 * Decodes UTF-8 bytes to a string.
 *
 * The runtime contract is `unknown`. A `Uint8Array` is required. A `Buffer`
 * is a `Uint8Array` and is accepted. Any other value, and bytes that are
 * not valid UTF-8, return `undefined`. The function does not throw for
 * those inputs.
 *
 * @param bytes - A `Uint8Array` of UTF-8 bytes, or any other value.
 * @returns The text, or `undefined` when `bytes` is not a `Uint8Array` or is not UTF-8.
 * @example
 * fromUTF8Bytes(new Uint8Array([104, 105]));
 */
export function fromUTF8Bytes(bytes: unknown): string | undefined {
    if (!(bytes instanceof Uint8Array)) {
        return undefined;
    }
    return decodeUtf8(bytes);
}
