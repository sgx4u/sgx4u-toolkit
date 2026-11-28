/**
 * Reports whether `value` is a string primitive, including an empty string.
 *
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string matches.
 * @example
 * isString("hello");
 */
export function isString(value: unknown): value is string {
    return typeof value === "string";
}
