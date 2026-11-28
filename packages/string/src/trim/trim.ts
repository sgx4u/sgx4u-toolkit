import { readTrimCall, trimUnits } from "../utils/trim.utils.js";
import type { TrimOptions } from "./trim.types.js";

/**
 * Trims graphemes from both ends of `value`.
 *
 * With no `characters`, Unicode whitespace is removed. Otherwise each
 * grapheme of `characters` is trimmed. The input is not changed.
 *
 * @param value - The text to trim.
 * @returns The trimmed string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `characters` is present and is not a string.
 * @example
 * trim("  hello  ");
 */
export function trim(value: string): string | undefined;
/**
 * @param options - `value` and optional `characters`.
 * @returns The trimmed string, or `undefined` when `value` is not a string.
 */
export function trim(options: TrimOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `characters`.
 * @returns The trimmed string, or `undefined` when `value` is not a string.
 */
export function trim(valueOrOptions: unknown): string | undefined {
    const resolved = readTrimCall(valueOrOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return trimUnits(resolved.value, resolved.characters, true, true);
}
