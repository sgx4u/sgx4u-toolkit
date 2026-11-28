import { removeCommonIndent } from "../dedent/dedent.js";

/**
 * Removes the common indent and keeps a first line that has no indent.
 *
 * Unlike `dedent`, this does not drop a leading or trailing newline.
 * The input is not changed.
 *
 * @param value - The text to strip.
 * @returns The stripped string, or `undefined` when `value` is not a string.
 * @example
 * stripIndent("a\n  b");
 */
export function stripIndent(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    return removeCommonIndent(value, true);
}
