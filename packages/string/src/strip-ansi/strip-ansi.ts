import { stripAnsiEscapes } from "../utils/ansi.utils.js";

/**
 * Removes ANSI escape sequences from `value`.
 *
 * CSI, OSC, and single-character ESC sequences are removed. This is a
 * display helper, not a security filter. The input is not changed.
 *
 * @param value - Text that may contain terminal escapes. A non-string returns `undefined`.
 * @returns The text without those sequences, or `undefined` when `value` is not a string.
 * @example
 * stripANSI("\u001B[31mred\u001B[0m");
 */
export function stripANSI(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return stripAnsiEscapes(value);
}
