import { readBoolean, readOptionalString } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { HighlightMatchesOptions } from "./highlight-matches.types.js";

/**
 * Wraps literal matches of `query` with `prefix` and `suffix`.
 *
 * The query is matched against the original text. When `escapeValue` is
 * true, each text segment is escaped after the match, so `&`, `<`, `>`,
 * `"`, and `'` in the source become entities and the result can be
 * inserted into HTML. The prefix and suffix are inserted as given. An
 * empty query does not wrap anything. A non-string `value` returns
 * `undefined`. The input is not changed.
 *
 * @param value - The text to search. No query means the escaped text.
 * @returns The marked string, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @example
 * highlightMatches({ value: "hello", query: "ell" });
 */
export function highlightMatches(value: string): string | undefined;
/**
 * @param options - `value`, `query`, and the wrap options.
 * @returns The marked string, or `undefined` when `value` is not a string.
 */
export function highlightMatches(
    options: HighlightMatchesOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The marked string, or `undefined` when `value` is not a string.
 */
export function highlightMatches(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        query: readOptionalString("query", record.query) ?? "",
        prefix: readOptionalString("prefix", record.prefix) ?? "<mark>",
        suffix: readOptionalString("suffix", record.suffix) ?? "</mark>",
        ignoreCase: readBoolean("ignoreCase", record.ignoreCase, true),
        escapeValue: readBoolean("escapeValue", record.escapeValue, true),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return wrapMatches(
        resolved.value,
        resolved.options.query,
        resolved.options.prefix,
        resolved.options.suffix,
        resolved.options.ignoreCase,
        resolved.options.escapeValue,
    );
}

/**
 * Builds the marked string from the original text.
 *
 * @param source - The original text.
 * @param query - The literal query. An empty query wraps nothing.
 * @param prefix - Text inserted before each match.
 * @param suffix - Text inserted after each match.
 * @param ignoreCase - When `true`, matching ignores case.
 * @param escapeValue - When `true`, text segments are HTML-escaped.
 * @returns The marked string.
 */
function wrapMatches(
    source: string,
    query: string,
    prefix: string,
    suffix: string,
    ignoreCase: boolean,
    escapeValue: boolean,
): string {
    const render = (text: string): string =>
        escapeValue ? escapeText(text) : text;
    if (query.length === 0) {
        return render(source);
    }
    const expression = new RegExp(
        escapeForExpression(query),
        ignoreCase ? "giu" : "gu",
    );
    let result = "";
    let cursor = 0;
    for (const match of source.matchAll(expression)) {
        const index = match.index ?? 0;
        const matched = match[0] ?? "";
        result += render(source.slice(cursor, index));
        result += prefix;
        result += render(matched);
        result += suffix;
        cursor = index + matched.length;
    }
    result += render(source.slice(cursor));
    return result;
}

/**
 * Escapes the five ASCII characters that start HTML markup.
 *
 * @param text - One segment of the original text.
 * @returns The segment with `&`, `<`, `>`, `"`, and `'` escaped.
 */
function escapeText(text: string): string {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

/**
 * Escapes a literal string for use inside a regular expression.
 *
 * @param value - The query text.
 * @returns The query with metacharacters escaped.
 */
function escapeForExpression(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
