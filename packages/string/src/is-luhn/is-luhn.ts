import { passesLuhn } from "../utils/checksum.utils.js";

/**
 * Reports whether `value` passes the Luhn check.
 *
 * Spaces and hyphens are ignored. Any other non-digit returns `false`.
 * A value with no digits returns `false`. A non-string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the remaining digits pass the Luhn check.
 * @example
 * isLuhn("4242-4242-4242-4242");
 */
export function isLuhn(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const digits = digitsIgnoringSeparators(value);
    if (digits === undefined) {
        return false;
    }
    return passesLuhn(digits);
}

/**
 * Removes spaces and hyphens when the rest is digits.
 *
 * @param value - Candidate text.
 * @returns The digits, or `undefined` when none remain or another character is present.
 */
function digitsIgnoringSeparators(value: string): string | undefined {
    if (!/^[0-9 -]*$/u.test(value)) {
        return undefined;
    }
    const digits = value.replace(/[ -]/gu, "");
    return digits.length === 0 ? undefined : digits;
}
