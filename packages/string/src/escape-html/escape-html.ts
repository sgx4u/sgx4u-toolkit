const htmlEscapes: Readonly<Record<string, string>> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

/**
 * Escapes the five ASCII characters that start HTML markup.
 *
 * `&` becomes `&amp;`, `<` becomes `&lt;`, `>` becomes `&gt;`, `"` becomes
 * `&quot;`, and `'` becomes `&#39;`. This is not a sanitizer. Attribute
 * values should still be quoted, because the escaped text is only safe
 * inside a quoted attribute or as text content when these five characters
 * were the only markup. The input is not changed.
 *
 * @param value - Text to escape. A non-string returns `undefined`.
 * @returns The escaped text, or `undefined` when `value` is not a string.
 * @example
 * escapeHTML(`<a href="x">`);
 */
export function escapeHTML(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    let escaped = "";
    for (const character of value) {
        escaped += htmlEscapes[character] ?? character;
    }
    return escaped;
}
