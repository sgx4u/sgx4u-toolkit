/**
 * Groups the digits in `value` into fours.
 *
 * Non-digits are dropped. Groups are separated by one space. The last
 * group may be shorter than four. A value with no digits, and a non-string,
 * return `undefined`. The check digit is not verified. The input is not
 * changed.
 *
 * @param value - Any value. Only a string is formatted.
 * @returns The grouped digits, or `undefined` when no digits remain.
 * @example
 * formatCreditCardNumber("4242424242424242");
 */
export function formatCreditCardNumber(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const digits = value.replace(/\D/gu, "");
    if (digits.length === 0) {
        return undefined;
    }
    return groupsOf(digits, 4);
}

/**
 * Splits `text` into groups of `size` and joins them with spaces.
 *
 * @param text - The characters to group.
 * @param size - The group size.
 * @returns The grouped text.
 */
function groupsOf(text: string, size: number): string {
    const groups: string[] = [];
    for (let index = 0; index < text.length; index += size) {
        groups.push(text.slice(index, index + size));
    }
    return groups.join(" ");
}
