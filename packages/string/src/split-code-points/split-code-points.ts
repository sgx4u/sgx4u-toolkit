/**
 * Splits `value` into Unicode code points.
 *
 * A surrogate pair is one element. The result is a new array. The input
 * is not changed.
 *
 * @param value - The text to split.
 * @returns The code points, or `undefined` when `value` is not a string.
 * @example
 * splitCodePoints("😀");
 */
export function splitCodePoints(value: unknown): string[] | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return Array.from(value);
}
