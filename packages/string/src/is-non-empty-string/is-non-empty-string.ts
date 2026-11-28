/**
 * Reports whether `value` is a string with at least one UTF-16 code unit. Whitespace counts as content.
 *
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string matches.
 * @example
 * isNonEmptyString(" ");
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.length > 0;
}
