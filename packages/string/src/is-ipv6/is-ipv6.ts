import { matchesIPv4 } from "../is-ipv4/is-ipv4.js";

/**
 * Reports whether `value` is an IPv6 address.
 *
 * Compression with `::` may appear once. The last piece may be an IPv4
 * address, and that tail counts as two groups. A leading zero inside that
 * IPv4 tail is rejected. Zone identifiers such as `%eth0` are rejected.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an IPv6 address.
 * @example
 * isIPv6("2001:db8::1");
 */
export function isIPv6(value: unknown): boolean {
    return typeof value === "string" && matchesIPv6(value);
}

/**
 * Whether `value` is an IPv6 address.
 *
 * @param value - Candidate address text, without URL brackets.
 * @returns `true` when the groups fit in 128 bits.
 */
export function matchesIPv6(value: string): boolean {
    if (value.length === 0 || value.includes("%") || value.includes(":::")) {
        return false;
    }
    const compressionCount = value.split("::").length - 1;
    if (compressionCount > 1) {
        return false;
    }
    const sides = compressionCount === 1 ? value.split("::") : [value];
    let groupCount = 0;
    for (let sideIndex = 0; sideIndex < sides.length; sideIndex += 1) {
        const side = sides[sideIndex] ?? "";
        if (side.length === 0) {
            continue;
        }
        const parts = side.split(":");
        for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
            const part = parts[partIndex] ?? "";
            const isLast =
                sideIndex === sides.length - 1 &&
                partIndex === parts.length - 1;
            if (part.includes(".")) {
                if (!isLast || !matchesIPv4(part)) {
                    return false;
                }
                groupCount += 2;
                continue;
            }
            if (!/^[0-9A-Fa-f]{1,4}$/u.test(part)) {
                return false;
            }
            groupCount += 1;
        }
    }
    if (compressionCount === 1) {
        return groupCount < 8;
    }
    return groupCount === 8;
}
