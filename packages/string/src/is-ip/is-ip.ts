import { describeReceived } from "../utils/describe-received.utils.js";
import { matchesIPv4 } from "../is-ipv4/is-ipv4.js";
import { matchesIPv6 } from "../is-ipv6/is-ipv6.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IPVersion, IsIPOptions } from "./is-ip.types.js";

export type { IPVersion, IsIPOptions } from "./is-ip.types.js";

/**
 * Reports whether `value` is an IPv4 or IPv6 address.
 *
 * `version` defaults to `"any"`. `4` and `6` keep one family. IPv4 rejects
 * a leading zero. IPv6 allows one `::` and an IPv4 tail. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the address matches `version`.
 * @throws {@link TypeError} When `version` is not a number or a string.
 * @throws {@link RangeError} When `version` is not `4`, `6`, or `"any"`.
 * @example
 * isIP("192.0.2.1");
 */
export function isIP(value: unknown): boolean;
/**
 * @param options - `value` and optional `version`.
 * @returns `true` when the address matches `version`.
 */
export function isIP(options: IsIPOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `version`.
 * @returns `true` when the address matches `version`.
 */
export function isIP(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        version: readIPVersion(record.version),
    }));
    if (resolved === undefined) {
        return false;
    }
    return matchesIP(resolved.value, resolved.options.version);
}

/**
 * Reads the `version` option.
 *
 * @param value - The option value.
 * @returns `4`, `6`, or `"any"`.
 * @throws {@link TypeError} When `value` is present and is not a number or a string.
 * @throws {@link RangeError} When the version is not supported.
 */
function readIPVersion(value: unknown): IPVersion {
    if (value === undefined || value === "any") {
        return "any";
    }
    if (value === 4 || value === 6) {
        return value;
    }
    if (typeof value === "number" || typeof value === "string") {
        throw new RangeError(
            `version must be 4, 6, or "any". Received ${describeReceived(value)}.`,
        );
    }
    throw new TypeError(
        `version must be a number or a string. Received ${describeReceived(value)}.`,
    );
}

/**
 * Whether `value` matches `version`.
 *
 * @param value - Candidate address text.
 * @param version - The family to accept.
 * @returns `true` when the address is in that family.
 */
function matchesIP(value: string, version: IPVersion): boolean {
    if (version === 4) {
        return matchesIPv4(value);
    }
    if (version === 6) {
        return matchesIPv6(value);
    }
    return matchesIPv4(value) || matchesIPv6(value);
}
