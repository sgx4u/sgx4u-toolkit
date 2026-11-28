/** Whitespace at either end. U+FEFF is not whitespace. */
const edgeWhitespaceExpression = /^\p{White_Space}+|\p{White_Space}+$/gu;

/** A run of Unicode whitespace. */
const whitespaceRunExpression = /\p{White_Space}+/gu;

/**
 * Collapses each whitespace run to one ASCII space and trims the ends.
 *
 * Whitespace is `\p{White_Space}`, so a non-breaking space collapses and a
 * byte-order mark stays. The input is not changed.
 *
 * @returns The collapsed string, or `undefined` when `value` is not a string.
 * @example
 * collapseWhitespace("  a   b  ");
 */
export function collapseWhitespace(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return value
        .replace(edgeWhitespaceExpression, "")
        .replace(whitespaceRunExpression, " ");
}
