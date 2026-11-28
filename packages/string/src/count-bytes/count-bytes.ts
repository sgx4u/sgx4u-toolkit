/**
 * Returns the UTF-8 byte length of `value`.
 *
 * The input is not changed.
 *
 * @param value - The text to measure.
 * @returns The byte length, or `undefined` when `value` is not a string.
 * @example
 * countBytes("é");
 */
export function countBytes(value: unknown): number | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return new TextEncoder().encode(value).length;
}
