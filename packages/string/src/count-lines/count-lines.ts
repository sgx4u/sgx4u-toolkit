import { splitLines } from "../split-lines/split-lines.js";
import type { SplitLinesOptions } from "../split-lines/split-lines.types.js";

/**
 * Counts lines with the same split as `splitLines`.
 *
 * The input is not changed.
 *
 * @param value - The text to count.
 * @returns The line count, or `undefined` when `value` is not a string.
 * @example
 * countLines("a\nb");
 */
export function countLines(value: string): number | undefined;
/** @param options - `value` and `omitEmpty`. */
export function countLines(options: SplitLinesOptions): number | undefined;
/** @param valueOrOptions - A string, or `value` plus `omitEmpty`. */
export function countLines(valueOrOptions: unknown): number | undefined {
    const lines = splitLines(valueOrOptions as string);
    return lines === undefined ? undefined : lines.length;
}
