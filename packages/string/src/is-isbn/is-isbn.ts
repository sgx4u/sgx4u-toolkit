/**
 * Reports whether `value` is an ISBN-10 or ISBN-13.
 *
 * Hyphens and spaces are ignored. ISBN-10 may end in `X`, which has value
 * 10, and the weighted sum is divisible by 11. ISBN-13 starts with `978`
 * or `979` and uses the GTIN alternating 1 and 3 weights. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the remaining characters are a valid ISBN.
 * @example
 * isISBN("978-0-306-40615-7");
 */
export function isISBN(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const compact = value.replace(/[ -]/gu, "");
    if (/^[0-9]{9}[0-9Xx]$/u.test(compact)) {
        return passesIsbn10(compact);
    }
    if (/^97[89][0-9]{10}$/u.test(compact)) {
        return passesGtin(compact);
    }
    return false;
}

/**
 * Whether `digits` passes the ISBN-10 mod-11 check.
 *
 * @param digits - Ten characters. The last may be `X`.
 * @returns `true` when the weighted sum is divisible by 11.
 */
function passesIsbn10(digits: string): boolean {
    let sum = 0;
    for (let index = 0; index < 10; index += 1) {
        const character = digits[index] ?? "";
        const number =
            index === 9 && (character === "X" || character === "x")
                ? 10
                : Number(character);
        sum += number * (10 - index);
    }
    return sum % 11 === 0;
}

/**
 * Whether `digits` passes the GTIN check used by ISBN-13.
 *
 * From the right, the digit beside the check digit has weight 3, then the
 * weights alternate. The check digit has weight 1.
 *
 * @param digits - Thirteen digits.
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
