const escapeCharacter = "\u001B";
const bellCharacter = "\u0007";

/**
 * Reads one ANSI escape that starts at `index`.
 *
 * CSI, OSC, and the single-character ESC Fe sequences are recognized.
 * The walk is one character at a time.
 *
 * @param value - The text.
 * @param index - The index of an ESC character.
 * @returns The index after the sequence, or `undefined` when this ESC is not a sequence.
 */
function readAnsiEscape(value: string, index: number): number | undefined {
    if (value[index] !== escapeCharacter) {
        return undefined;
    }
    const next = value[index + 1];
    if (next === undefined) {
        return undefined;
    }
    if (next === "[") {
        return readControlSequence(value, index + 2);
    }
    if (next === "]") {
        return readOperatingSystemCommand(value, index + 2);
    }
    if (isFeCharacter(next)) {
        return index + 2;
    }
    return undefined;
}

/**
 * @param character - The byte after ESC.
 * @returns `true` for `@` through `_`.
 */
function isFeCharacter(character: string): boolean {
    const code = character.charCodeAt(0);
    return code >= 0x40 && code <= 0x5f;
}

/**
 * @param value - The text.
 * @param index - The first byte after `ESC [`.
 * @returns The index after the final CSI byte.
 */
function readControlSequence(value: string, index: number): number | undefined {
    let cursor = index;
    while (cursor < value.length) {
        const code = value.charCodeAt(cursor);
        if (code >= 0x40 && code <= 0x7e) {
            return cursor + 1;
        }
        const isParameter = code >= 0x30 && code <= 0x3f;
        const isIntermediate = code >= 0x20 && code <= 0x2f;
        if (!isParameter && !isIntermediate) {
            return undefined;
        }
        cursor += 1;
    }
    return undefined;
}

/**
 * @param value - The text.
 * @param index - The first byte after `ESC ]`.
 * @returns The index after BEL or the string terminator.
 */
function readOperatingSystemCommand(
    value: string,
    index: number,
): number | undefined {
    let cursor = index;
    while (cursor < value.length) {
        if (value[cursor] === bellCharacter) {
            return cursor + 1;
        }
        if (
            value[cursor] === escapeCharacter &&
            value[cursor + 1] === "\\"
        ) {
            return cursor + 2;
        }
        cursor += 1;
    }
    return undefined;
}

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
    let result = "";
    let cursor = 0;
    while (cursor < value.length) {
        const escapeIndex = value.indexOf(escapeCharacter, cursor);
        if (escapeIndex === -1) {
            result += value.slice(cursor);
            break;
        }
        const end = readAnsiEscape(value, escapeIndex);
        result += value.slice(cursor, escapeIndex);
        cursor = end ?? escapeIndex + 1;
    }
    return result;
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
    while (cursor < value.length) {
        const escapeIndex = value.indexOf(escapeCharacter, cursor);
        if (escapeIndex === -1) {
            break;
        }
        const end = readAnsiEscape(value, escapeIndex);
        if (end === undefined) {
            cursor = escapeIndex + 1;
            continue;
        }
        if (escapeIndex > cursor) {
            parts.push({
                text: value.slice(cursor, escapeIndex),
                isEscape: false,
            });
        }
        parts.push({
            text: value.slice(escapeIndex, end),
            isEscape: true,
        });
        cursor = end;
    }
    if (cursor < value.length) {
        parts.push({ text: value.slice(cursor), isEscape: false });
    }
    return parts;
}
