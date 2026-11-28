/**
 * Reports whether `value` is an EAN-8 or EAN-13 code.
 *
 * Spaces and hyphens are ignored. The check is the GTIN alternating weight:
 * from the right, the digit beside the check digit has weight 3, then the
 * weights alternate, and the check digit has weight 1. That is the same
 * rule ISBN-13 uses, so an EAN-13 starts with weight 1 and an EAN-8 starts
 * with weight 3. Other lengths are rejected. A non-string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an EAN-8 or EAN-13.
 * @example
 * isEAN("4006381333931");
 */
export function isEAN(value: unknown): boolean {
    if (typeof value !== "string" || !/^[0-9 -]+$/u.test(value)) {
        return false;
    }
    const digits = value.replace(/[ -]/gu, "");
    if (digits.length !== 8 && digits.length !== 13) {
        return false;
    }
    return passesGtin(digits);
}

/**
 * Whether `digits` passes the GTIN check.
 *
 * @param digits - Eight or thirteen digits.
 * @returns `true` when the weighted sum is divisible by 10.
 */
function passesGtin(digits: string): boolean {
    let sum = 0;
    const checkIndex = digits.length - 1;
    for (let index = 0; index < checkIndex; index += 1) {
        const distanceFromCheck = checkIndex - index;
        const weight = distanceFromCheck % 2 === 1 ? 3 : 1;
        sum += Number(digits[index]) * weight;
    }
    return (sum + Number(digits[checkIndex])) % 10 === 0;
}
