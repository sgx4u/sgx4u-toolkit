/**
 * Escapes `value` so it can sit inside a JavaScript or JSON string literal.
 *
 * Quotes, backslashes, controls, and line separators are escaped. The
 * result is the literal body, without the surrounding quotes. The input is not changed.
 *
 * @param value - The text to escape.
 * @returns The escaped body, or `undefined` when `value` is not a string.
 * @example
 * escapeJavaScriptString('a"b');
 */
export function escapeJavaScriptString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;
    // eslint-disable-next-line no-control-regex -- C0 controls are escaped as JSON string escapes
    return value.replace(/[\u0000-\u001F\u2028\u2029\\"'`]/gu, (character) => {
        const named: Record<string, string> = {
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t",
            "\b": "\\b",
            "\f": "\\f",
            "\\": "\\\\",
            '"': '\\"',
            "'": "\\'",
            "`": "\\`",
        };
        return (
            named[character] ??
            `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`
        );
    });
}
