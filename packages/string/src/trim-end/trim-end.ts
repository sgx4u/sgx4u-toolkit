import { readTrimCall, trimUnits } from "../utils/trim.utils.js";
import type { TrimOptions } from "../trim/trim.types.js";

/**
 * Trims graphemes from the end of `value`.
 *
 * With no `characters`, Unicode whitespace is removed. The input is not changed.
 *
 * @param value - The text to trim.
 * @returns The trimmed string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `characters` is present and is not a string.
 * @example
 * trimEnd("hello  ");
 */
export function trimEnd(value: string): string | undefined;
/**
 * @param options - `value` and optional `characters`.
 * @returns The trimmed string, or `undefined` when `value` is not a string.
 */
export function trimEnd(options: TrimOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `characters`.
 * @returns The trimmed string, or `undefined` when `value` is not a string.
 */
export function trimEnd(valueOrOptions: unknown): string | undefined {
    const resolved = readTrimCall(valueOrOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return trimUnits(resolved.value, resolved.characters, false, true);
}
