import { isURL } from "../is-url/is-url.js";

/**
 * Finds URLs in `value`.
 *
 * Each result uses the same defaults as `isURL`: `http` or `https`, a
 * protocol, a top-level domain, and no localhost, IP host, or credentials.
 * Matches are returned in order and do not share a span. Trailing sentence
 * punctuation is left off when the shorter text is still a URL. An input
 * with no URL returns an empty array. A non-string returns `undefined`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string is scanned.
 * @returns The URLs, an empty array when there are none, or `undefined` when `value` is not a string.
 * @example
 * extractURLs("See https://example.com/docs.");
 */
export function extractURLs(value: unknown): string[] | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const results: string[] = [];
    for (const match of value.matchAll(/https?:\/\/[^\s<>]+/giu)) {
        const candidate = trimTrailingPunctuation(match[0] ?? "", (url) =>
            isURL(url),
        );
        if (candidate !== undefined) {
            results.push(candidate);
        }
    }
    return results;
}

/**
 * Drops trailing punctuation while the shorter text still matches.
 *
 * @param candidate - A regex hit that may include sentence punctuation.
 * @param accept - The practical checker for one result.
 * @returns The kept text, or `undefined` when nothing matches.
 */
function trimTrailingPunctuation(
    candidate: string,
    accept: (value: string) => boolean,
): string | undefined {
    let current = candidate;
    while (current.length > 0) {
        if (accept(current)) {
            const last = current[current.length - 1] ?? "";
            if (/[.,;:!?)]/u.test(last) && accept(current.slice(0, -1))) {
                current = current.slice(0, -1);
                continue;
            }
            return current;
        }
        const last = current[current.length - 1] ?? "";
        if (!/[.,;:!?)]/u.test(last)) {
            return undefined;
        }
        current = current.slice(0, -1);
    }
    return undefined;
}
