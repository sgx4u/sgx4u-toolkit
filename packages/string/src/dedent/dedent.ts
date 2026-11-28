/**
 * Removes the common leading indent and one leading and trailing newline.
 *
 * Blank lines do not affect the common indent. The input is not changed.
 * This is the plain-string form. It does not accept a template tag.
 *
 * @param value - The text to dedent, usually a source snippet.
 * @returns The dedented string, or `undefined` when `value` is not a string.
 * @example
 * dedent("\n  a\n    b\n");
 */
export function dedent(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return removeCommonIndent(stripOneEdgeNewline(value), false);
}

/**
 * Removes one leading newline and one trailing newline.
 *
 * `\r\n` counts as one newline. A string that does not start or end with a
 * newline is returned unchanged.
 *
 * @param value - The source text.
 * @returns The text with at most one newline removed from each end.
 */
function stripOneEdgeNewline(value: string): string {
    let text = value;
    if (text.startsWith("\r\n")) {
        text = text.slice(2);
    } else if (text.startsWith("\n") || text.startsWith("\r")) {
        text = text.slice(1);
    }
    if (text.endsWith("\r\n")) {
        text = text.slice(0, -2);
    } else if (text.endsWith("\n") || text.endsWith("\r")) {
        text = text.slice(0, -1);
    }
    return text;
}

/**
 * Removes the shared leading whitespace of the non-empty lines.
 *
 * @param text - The source after the optional newline trim.
 * @param keepUnindentedFirstLine - When true, a first line with no indent is left as it is and does not set the common indent to empty.
 * @returns The text with the common indent removed.
 */
function removeCommonIndent(
    text: string,
    keepUnindentedFirstLine: boolean,
): string {
    const lines = text.split("\n");
    const measured = lines.map((line, index) => ({
        line,
        index,
        indent: /^[ \t]*/u.exec(line)?.[0] ?? "",
        blank: line.trim().length === 0,
    }));
    const candidates = measured.filter((entry) => {
        if (entry.blank) {
            return false;
        }
        if (
            keepUnindentedFirstLine &&
            entry.index === 0 &&
            entry.indent.length === 0
        ) {
            return false;
        }
        return true;
    });
    let common = candidates[0]?.indent ?? "";
    for (const entry of candidates) {
        while (!entry.indent.startsWith(common)) {
            common = common.slice(0, -1);
        }
    }
    return lines
        .map((line, index) => {
            if (line.trim().length === 0) {
                return "";
            }
            if (
                keepUnindentedFirstLine &&
                index === 0 &&
                !line.startsWith(common)
            ) {
                return line;
            }
            return line.startsWith(common) ? line.slice(common.length) : line;
        })
        .join("\n");
}

export { removeCommonIndent };
