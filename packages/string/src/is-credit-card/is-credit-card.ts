import { passesLuhn } from "../utils/checksum.utils.js";

/**
 * Reports whether `value` is a payment-card number.
 *
 * Spaces and hyphens are ignored. The digits must pass the Luhn check and
 * an issuer length rule:
 *
 * - Visa starts with `4` and has length 13, 16, or 19.
 * - Mastercard is `51`–`55` or `2221`–`2720` and has length 16.
 * - American Express starts with `34` or `37` and has length 15.
 * - Discover starts with `6011`, `65`, or `644`–`649` and has length 16.
 * - UnionPay starts with `62` and has length 16 through 19.
 * - Any other 13 through 19 digit Luhn number is accepted as a generic card.
 *
 * A known issuer with the wrong length is rejected. A non-string returns
 * `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the digits pass Luhn and an issuer length rule.
 * @example
 * isCreditCard("4242424242424242");
 */
export function isCreditCard(value: unknown): boolean {
    if (typeof value !== "string" || !/^[0-9 -]+$/u.test(value)) {
        return false;
    }
    const digits = value.replace(/[ -]/gu, "");
    if (!issuerLengthMatches(digits)) {
        return false;
    }
    return passesLuhn(digits);
}

/**
 * Whether `digits` has the length required by its issuer range.
 *
 * @param digits - Digits with separators already removed.
 * @returns `true` when the length matches a brand, or the generic 13–19 range.
 */
function issuerLengthMatches(digits: string): boolean {
    const length = digits.length;
    if (length < 13 || length > 19) {
        return false;
    }
    if (digits.startsWith("34") || digits.startsWith("37")) {
        return length === 15;
    }
    if (digits.startsWith("4")) {
        return length === 13 || length === 16 || length === 19;
    }
    if (isMastercardRange(digits)) {
        return length === 16;
    }
    if (isDiscoverRange(digits)) {
        return length === 16;
    }
    if (digits.startsWith("62")) {
        return length >= 16 && length <= 19;
    }
    return true;
}

/**
 * Whether `digits` begins with a Mastercard issuer range.
 *
 * @param digits - Card digits.
 * @returns `true` for `51`–`55` or `2221`–`2720`.
 */
function isMastercardRange(digits: string): boolean {
    const firstTwo = Number(digits.slice(0, 2));
    if (firstTwo >= 51 && firstTwo <= 55) {
        return true;
    }
    const firstFour = Number(digits.slice(0, 4));
    return firstFour >= 2221 && firstFour <= 2720;
}

/**
 * Whether `digits` begins with a Discover issuer range.
 *
 * @param digits - Card digits.
 * @returns `true` for `6011`, `65`, or `644`–`649`.
 */
function isDiscoverRange(digits: string): boolean {
    if (digits.startsWith("6011") || digits.startsWith("65")) {
        return true;
    }
    const firstThree = Number(digits.slice(0, 3));
    return firstThree >= 644 && firstThree <= 649;
}
