const repeatedWhitespace = /\s+/g;

/**
 * Returns a new string with surrounding whitespace removed and each
 * internal whitespace run replaced by one space.
 *
 * Whitespace matches `\s`, the same set `String.prototype.trim` removes.
 * `value` is not modified. A whitespace-only string becomes `""`. One
 * space between words stays one space.
 *
 * @param value - Any string. A non-string is not checked at runtime.
 * @example
 * collapseWhitespace("  a \t b\nc  ")
 */
export function collapseWhitespace(value: string): string {
    return value.trim().replace(repeatedWhitespace, " ");
}
