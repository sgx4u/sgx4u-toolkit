const token = "[!#$%&'*+.^_`|~0-9A-Za-z-]+";
const mimeTypeExpression = new RegExp(`^${token}/${token}$`, "u");

/**
 * Reports whether `value` is a media type of `type/subtype`.
 *
 * Both tokens use the HTTP token alphabet. Parameters, spaces, and a
 * trailing slash are rejected. A non-string returns `false`. The input
 * is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is `type/subtype`.
 * @example
 * isMimeType("text/plain");
 */
export function isMimeType(value: unknown): boolean {
    return typeof value === "string" && mimeTypeExpression.test(value);
}
