/**
 * Returns whether `value` is empty or only whitespace.
 *
 * Whitespace is the set `String.prototype.trim` removes: space, tab,
 * newline, and the other Unicode space separators. `value` is not modified.
 * The empty string is blank.
 *
 * @param value - Any string. A non-string is not checked at runtime.
 * @example
 * isBlank(" \n\t")
 */
export function isBlank(value: string): boolean {
    return value.trim().length === 0;
}
