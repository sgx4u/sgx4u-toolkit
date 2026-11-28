/**
 * CSI, OSC, and the single-character ESC sequences used by terminals.
 *
 * The pattern is linear. It does not match across an unrelated ESC.
 */
const ansiEscapeExpression =
    // eslint-disable-next-line no-control-regex -- ESC and BEL delimit CSI and OSC sequences
    /\u001B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\u001B\\))/g;

/**
 * Removes ANSI escape sequences from `value`.
 *
 * CSI, OSC, and single-character ESC sequences are removed. The input is
 * not changed. This is a display helper, not a security filter.
 *
 * @param value - Text that may contain terminal escapes.
 * @returns A new string without those sequences.
 */
export function stripAnsiEscapes(value: string): string {
    return value.replace(ansiEscapeExpression, "");
}

/**
 * One slice of a string that is either plain text or one escape sequence.
 */
export interface AnsiPart {
    /** The slice. */
    text: string;
    /** `true` when `text` is an escape sequence. */
    isEscape: boolean;
}

/**
 * Splits `value` into plain text and ANSI escape sequences, in order.
 *
 * @param value - Text that may contain terminal escapes.
 * @returns A new array of parts. Adjacent plain text stays one part.
 */
export function splitAnsiParts(value: string): AnsiPart[] {
    const parts: AnsiPart[] = [];
    let cursor = 0;
    for (const match of value.matchAll(ansiEscapeExpression)) {
        const index = match.index;
        if (index > cursor) {
            parts.push({ text: value.slice(cursor, index), isEscape: false });
        }
        parts.push({ text: match[0], isEscape: true });
        cursor = index + match[0].length;
    }
    if (cursor < value.length) {
        parts.push({ text: value.slice(cursor), isEscape: false });
    }
    return parts;
}
