/** Unicode White_Space, including a non-breaking space. U+FEFF is not included. */
const unicodeWhitespaceExpression = /^\p{White_Space}*$/u;

/**
 * Reports whether `value` is empty or contains only Unicode whitespace.
 *
 * The test is `\p{White_Space}`, so a non-breaking space counts and a
 * byte-order mark does not. A non-string returns `false`. The input is not
 * changed.
 *
 * @returns `true` when `value` is `""` or only Unicode whitespace.
 * @example
 * isBlank("  ");
 */
export function isBlank(value: unknown): boolean {
    return typeof value === "string" && unicodeWhitespaceExpression.test(value);
}
