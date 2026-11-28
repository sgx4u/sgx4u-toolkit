import { readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type {
    QuoteStyle,
    UnquoteStringOptions,
} from "./unquote-string.types.js";

const quoteStyles = ["double", "single", "backtick"] as const;

const quoteCharacters: Record<QuoteStyle, string> = {
    double: '"',
    single: "'",
    backtick: "`",
};

/**
 * Removes one matching surrounding quote pair and unescapes it.
 *
 * Backslashes and the chosen quote are unescaped. A string that is not
 * wrapped in the chosen quote is returned unchanged. When `style` is
 * omitted, the first and last characters must be the same `"`, `'`, or
 * backtick. The input is not changed.
 *
 * @param value - The text to unwrap.
 * @returns The unquoted string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `style` is unknown.
 * @throws {@link TypeError} When `style` is present and is not a string.
 * @example
 * unquoteString('"a"');
 */
export function unquoteString(value: string): string | undefined;
/**
 * @param options - `value` and an optional `style`.
 * @returns The unquoted string, or `undefined` when `value` is not a string.
 */
export function unquoteString(
    options: UnquoteStringOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `style`.
 * @returns The unquoted string, or `undefined` when `value` is not a string.
 */
export function unquoteString(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        style:
            record.style === undefined
                ? undefined
                : readEnum("style", record.style, quoteStyles, "double"),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    const quote =
        resolved.options.style === undefined
            ? detectedQuote(resolved.value)
            : quoteCharacters[resolved.options.style];
    if (quote === undefined || !isWrapped(resolved.value, quote)) {
        return resolved.value;
    }
    return unescapeQuoted(resolved.value.slice(1, -1), quote);
}

/**
 * The quote character when both ends use the same supported quote.
 *
 * @param value - The text that may be wrapped.
 * @returns The quote, or `undefined` when the ends do not match.
 */
function detectedQuote(value: string): string | undefined {
    if (value.length < 2) {
        return undefined;
    }
    const first = value[0];
    const last = value[value.length - 1];
    if (
        first !== undefined &&
        first === last &&
        (first === '"' || first === "'" || first === "`")
    ) {
        return first;
    }
    return undefined;
}

/**
 * Whether `value` starts and ends with `quote`.
 *
 * @param value - The text to test.
 * @param quote - The quote character.
 * @returns `true` when both ends are `quote`.
 */
function isWrapped(value: string, quote: string): boolean {
    return (
        value.length >= 2 && value.startsWith(quote) && value.endsWith(quote)
    );
}

/**
 * Turns `\\` and an escaped quote back into the original characters.
 *
 * Other backslash pairs are left as written.
 *
 * @param value - The text inside the quotes.
 * @param quote - The quote that was escaped.
 * @returns The unescaped text.
 */
function unescapeQuoted(value: string, quote: string): string {
    let result = "";
    for (let index = 0; index < value.length; index += 1) {
        const character = value.charAt(index);
        if (character === "\\" && index + 1 < value.length) {
            const next = value.charAt(index + 1);
            if (next === "\\" || next === quote) {
                result += next;
                index += 1;
                continue;
            }
        }
        result += character;
    }
    return result;
}
