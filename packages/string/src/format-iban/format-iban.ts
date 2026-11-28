/**
 * Groups the letters and digits in `value` into fours.
 *
 * Existing spaces and other non-alphanumeric characters are removed, then
 * the rest is uppercased. Groups are separated by one space. The checksum
 * is not checked. A value with no letters or digits, and a non-string,
 * return `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a string is formatted.
 * @returns The grouped text, or `undefined` when nothing alphanumeric remains.
 * @example
 * formatIBAN("GB82WEST12345698765432");
 */
export function formatIBAN(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const compact = value.replace(/[^0-9A-Za-z]/gu, "").toUpperCase();
    if (compact.length === 0) {
        return undefined;
    }
    const groups: string[] = [];
    for (let index = 0; index < compact.length; index += 4) {
        groups.push(compact.slice(index, index + 4));
    }
    return groups.join(" ");
}
