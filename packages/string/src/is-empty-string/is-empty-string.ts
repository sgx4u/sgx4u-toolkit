/**
 * Reports whether `value` is exactly the empty string.
 *
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string matches.
 * @example
 * isEmptyString("");
 */
export function isEmptyString(value: unknown): boolean {
    return value === "";
}
