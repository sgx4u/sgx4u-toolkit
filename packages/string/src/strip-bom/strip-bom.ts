/**
 * Removes one leading U+FEFF byte order mark.
 *
 * A string without that character is returned unchanged. The input is not changed.
 *
 * @param value - The text to strip.
 * @returns The string without a leading BOM, or `undefined` when `value` is not a string.
 * @example
 * stripBOM("\uFEFFhello");
 */
export function stripBOM(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return value.startsWith("\uFEFF") ? value.slice(1) : value;
}
