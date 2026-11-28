/**
 * Reports whether `value` is already in lower case and contains a cased letter.
 *
 * Comparison uses the runtime locale. An empty string and a string with no
 * cased letter return `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string is lower case.
 * @example
 * isLowerCase("abc");
 */
export function isLowerCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (value !== value.toLocaleLowerCase()) {
        return false;
    }
    return /\p{Ll}|\p{Lu}|\p{Lt}/u.test(value);
}
