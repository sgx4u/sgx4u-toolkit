/**
 * Reports whether `value` is RFC 4648 Base32.
 *
 * The alphabet is `A-Z` and `2-7`, compared without case. Padding is
 * optional. When padding is present the total length is a multiple of 8
 * and the pad count matches the body. A non-string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is Base32.
 * @example
 * isBase32("MZXW6YTB");
 */
export function isBase32(value: unknown): boolean {
    return typeof value === "string" && matchesBase32(value);
}

/**
 * Whether `value` is RFC 4648 Base32.
 *
 * @param value - Candidate text.
 * @returns `true` when the alphabet and padding length are valid.
 */
function matchesBase32(value: string): boolean {
    if (value.length === 0) {
        return true;
    }
    if (!/^[A-Za-z2-7]*={0,6}$/u.test(value)) {
        return false;
    }
    const paddingIndex = value.indexOf("=");
    if (paddingIndex === -1) {
        const remainder = value.length % 8;
        return (
            remainder === 0 ||
            remainder === 2 ||
            remainder === 4 ||
            remainder === 5 ||
            remainder === 7
        );
    }
    const paddingLength = value.length - paddingIndex;
    if (value.slice(paddingIndex) !== "=".repeat(paddingLength)) {
        return false;
    }
    if (value.length % 8 !== 0 || paddingLength > 6) {
        return false;
    }
    const remainder = paddingIndex % 8;
    const expectedPadding = remainder === 0 ? 0 : 8 - remainder;
    return paddingLength === expectedPadding;
}
