import { matchesIPv4 } from "../is-ipv4/is-ipv4.js";
import { matchesIPv6 } from "../is-ipv6/is-ipv6.js";

/**
 * Reports whether `value` is CIDR notation.
 *
 * An IPv4 prefix is an integer from 0 through 32. An IPv6 prefix is an
 * integer from 0 through 128. The address itself does not have to be the
 * network address: host bits may be set. A leading zero in the prefix is
 * rejected, except for `0`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an IP address, a slash, and a prefix length.
 * @example
 * isIPRange("192.0.2.0/24");
 */
export function isIPRange(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const slashIndex = value.indexOf("/");
    if (slashIndex <= 0 || slashIndex !== value.lastIndexOf("/")) {
        return false;
    }
    const address = value.slice(0, slashIndex);
    const prefixText = value.slice(slashIndex + 1);
    if (!/^(?:0|[1-9]\d{0,2})$/u.test(prefixText)) {
        return false;
    }
    const prefix = Number(prefixText);
    if (matchesIPv4(address)) {
        return prefix <= 32;
    }
    if (matchesIPv6(address)) {
        return prefix <= 128;
    }
    return false;
}
