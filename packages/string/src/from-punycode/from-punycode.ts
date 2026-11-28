import { domainFromPunycode } from "../utils/encoding.utils.js";

/**
 * Converts a punycode domain or label to Unicode.
 *
 * Labels that start with `xn--` are decoded. Other labels stay as they
 * are, in lowercase. A value that is not a domain or label, or a label
 * that cannot be decoded, returns `undefined`. A non-string returns
 * `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a domain string is converted.
 * @returns The Unicode domain, or `undefined` when `value` is not a domain.
 * @example
 * fromPunycode("xn--bcher-kva.example");
 */
export function fromPunycode(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return domainFromPunycode(value);
}
