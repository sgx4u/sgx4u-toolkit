/**
 * Joins wrapped lines back into paragraphs.
 *
 * A newline between words becomes a space. `\n`, `\r\n`, and `\r` all
 * count. A blank line, including a line that is only spaces or tabs, stays
 * a paragraph break. The input is not changed.
 *
 * @param value - The wrapped text.
 * @returns The unwrapped string, or `undefined` when `value` is not a string.
 * @example
 * unwrapText("hello\nworld");
 */
export function unwrapText(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const normalized = value
        .replace(/\r\n/gu, "\n")
        .replace(/\r/gu, "\n")
        .replace(/^[ \t]+$/gm, "");
    return normalized
        .split(/\n{2,}/u)
        .map((paragraph) => paragraph.replace(/[ \t]*\n[ \t]*/gu, " ").trim())
        .join("\n\n");
}
