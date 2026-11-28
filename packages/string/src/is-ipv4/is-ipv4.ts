/**
 * Reports whether `value` is a dotted IPv4 address.
 *
 * Each octet is a decimal integer from 0 through 255. A leading zero is
 * rejected, so `01.2.3.4` is false and `0.0.0.0` is true. The input is
 * not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an IPv4 address.
 * @example
 * isIPv4("192.0.2.1");
 */
export function isIPv4(value: unknown): boolean {
    return typeof value === "string" && matchesIPv4(value);
}

/**
 * Whether `value` is an IPv4 address.
 *
 * Callers pass a string. A leading zero is rejected except for the octet `0`.
 *
 * @param value - Candidate address text.
 * @returns `true` when all four octets are in range.
 */
export function matchesIPv4(value: string): boolean {
    const parts = value.split(".");
    if (parts.length !== 4) {
        return false;
    }
    for (const part of parts) {
        if (!/^(?:0|[1-9]\d{0,2})$/u.test(part)) {
            return false;
        }
        if (Number(part) > 255) {
            return false;
        }
    }
    return true;
}
