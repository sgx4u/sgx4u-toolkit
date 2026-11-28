/**
 * Reports whether `value` is a well-formed string of UTF-16 code units.
 *
 * This is `String.prototype.isWellFormed`. A lone surrogate returns
 * `false`. An empty string returns `true`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the string is well formed.
 * @example
 * isWellFormedString("hello");
 */
export function isWellFormedString(value: unknown): boolean {
    return typeof value === "string" && value.isWellFormed();
}
