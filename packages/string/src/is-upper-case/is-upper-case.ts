/**
 * Reports whether `value` is already in upper case and contains a cased letter.
 *
 * Comparison uses the runtime locale. An empty string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string is upper case.
 * @example
 * isUpperCase("ABC");
 */
export function isUpperCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (value !== value.toLocaleUpperCase()) {
        return false;
    }
    return /\p{Ll}|\p{Lu}|\p{Lt}/u.test(value);
}
