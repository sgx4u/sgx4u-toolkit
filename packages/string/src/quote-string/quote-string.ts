import { readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { QuoteStringOptions } from "./quote-string.types.js";

const quoteStyles = ["double", "single", "backtick"] as const;

const quotes = { double: '"', single: "'", backtick: "`" } as const;

/**
 * Wraps `value` in quotes and escapes that quote and backslashes inside it.
 *
 * The default style is a double quote. The input is not changed.
 *
 * @param value - The text to quote.
 * @returns The quoted string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `style` is unknown.
 * @throws {@link TypeError} When `style` is present and is not a string.
 * @example
 * quoteString("a");
 */
export function quoteString(value: string): string | undefined;
/**
 * @param options - `value` and an optional `style`.
 * @returns The quoted string, or `undefined` when `value` is not a string.
 */
export function quoteString(options: QuoteStringOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `style`.
 * @returns The quoted string, or `undefined` when `value` is not a string.
 */
export function quoteString(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        style: readEnum("style", record.style, quoteStyles, "double"),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const quote = quotes[resolved.options.style];
    const body = resolved.value
        .replace(/\\/gu, "\\\\")
        .replaceAll(quote, `\\${quote}`);
    return quote + body + quote;
}
