import { readBoolean } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { SplitLinesOptions } from "./split-lines.types.js";

/**
 * Splits `value` on `\n`, `\r\n`, and `\r`.
 *
 * The separators are not kept. The result is a new array. The input is not changed.
 *
 * @param value - The text to split.
 * @returns The lines, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `omitEmpty` is not a boolean.
 * @example
 * splitLines("a\nb");
 */
export function splitLines(value: string): string[] | undefined;
/** @param options - `value` and `omitEmpty`. */
export function splitLines(options: SplitLinesOptions): string[] | undefined;
/** @param valueOrOptions - A string, or `value` plus `omitEmpty`. */
export function splitLines(valueOrOptions: unknown): string[] | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        omitEmpty: readBoolean("omitEmpty", record.omitEmpty, false),
    }));
    if (resolved === undefined) return undefined;
    const lines = resolved.value.split(/\r\n|\n|\r/u);
    return resolved.options.omitEmpty
        ? lines.filter((line) => line.length > 0)
        : lines;
}
