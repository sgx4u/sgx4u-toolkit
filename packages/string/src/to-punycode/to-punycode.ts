import { domainToPunycode } from "../utils/encoding.utils.js";

/**
 * Converts a domain or label to ASCII punycode.
 *
 * International labels become `xn--` labels. A value that is not a domain
 * or label returns `undefined`. A non-string returns `undefined`. The
 * input is not changed.
 *
 * @param value - Any value. Only a domain string is converted.
 * @returns The ASCII hostname, or `undefined` when `value` is not a domain.
 * @example
 * toPunycode("bücher.example");
 */
export function toPunycode(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return domainToPunycode(value);
}
