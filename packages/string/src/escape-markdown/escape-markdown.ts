/**
 * Escapes ASCII punctuation so CommonMark renders the text literally.
 *
 * Each of `` !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ `` is prefixed with a
 * backslash. Letters, digits, and whitespace are copied. This does not
 * produce a fenced block or an HTML escape. The input is not changed.
 *
 * @param value - Text to escape. A non-string returns `undefined`.
 * @returns The escaped Markdown text, or `undefined` when `value` is not a string.
 * @example
 * escapeMarkdown("1 + 1 = 2");
 */
export function escapeMarkdown(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    let escaped = "";
    for (const character of value) {
        const codePoint = character.codePointAt(0) ?? 0;
        if (isMarkdownPunctuation(codePoint)) {
            escaped += `\\${character}`;
            continue;
        }
        escaped += character;
    }
    return escaped;
}

/**
 * @param codePoint - A Unicode code point.
 * @returns `true` for the ASCII punctuation CommonMark can treat as markup.
 */
function isMarkdownPunctuation(codePoint: number): boolean {
    return (
        (codePoint >= 0x21 && codePoint <= 0x2f) ||
        (codePoint >= 0x3a && codePoint <= 0x40) ||
        (codePoint >= 0x5b && codePoint <= 0x60) ||
        (codePoint >= 0x7b && codePoint <= 0x7e)
    );
}
