/**
 * Reports whether `value` is an ISSN.
 *
 * The form is eight characters, and the last may be `X`. One hyphen after
 * the fourth character is optional. Spaces are ignored. The weighted sum
 * uses weights 8 through 1 and must be divisible by 11. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an ISSN.
 * @example
 * isISSN("0378-5955");
 */
export function isISSN(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const compact = value.replace(/ /gu, "");
    const digits = compact.includes("-")
        ? hyphenatedDigits(compact)
        : /^[0-9]{7}[0-9Xx]$/u.test(compact)
          ? compact
          : undefined;
    if (digits === undefined) {
        return false;
    }
    return passesIssn(digits);
}

/**
 * Reads `NNNN-NNNC` and returns the eight characters.
 *
 * @param value - Text with spaces already removed.
 * @returns The eight characters, or `undefined` when the hyphen is somewhere else.
 */
function hyphenatedDigits(value: string): string | undefined {
    if (!/^[0-9]{4}-[0-9]{3}[0-9Xx]$/u.test(value)) {
        return undefined;
    }
    return value.slice(0, 4) + value.slice(5);
}

/**
 * Whether `digits` passes the ISSN mod-11 check.
 *
 * @param digits - Eight characters. The last may be `X`.
 * @returns `true` when the weighted sum is divisible by 11.
 */
function passesIssn(digits: string): boolean {
    let sum = 0;
    for (let index = 0; index < 8; index += 1) {
        const character = digits[index] ?? "";
        const number =
            index === 7 && (character === "X" || character === "x")
                ? 10
                : Number(character);
        sum += number * (8 - index);
    }
    return sum % 11 === 0;
}
