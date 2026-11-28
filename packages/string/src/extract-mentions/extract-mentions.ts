/**
 * Finds @-mentions in `value`.
 *
 * A mention is `@` plus letters, digits, and underscores. The `@` is
 * included in the result. An `@` that continues an email local part is
 * skipped, so `user@example.com` is not a mention. Matches are returned
 * in order and do not share a span. An input with no mention returns an
 * empty array. A non-string returns `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a string is scanned.
 * @returns The mentions, an empty array when there are none, or `undefined` when `value` is not a string.
 * @example
 * extractMentions("Hello @ada");
 */
export function extractMentions(value: unknown): string[] | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const results: string[] = [];
    const expression = /(?:^|[^\p{L}\p{N}_.+-])@([\p{L}\p{N}_]+)/gu;
    for (const match of value.matchAll(expression)) {
        const name = match[1];
        if (name !== undefined && name.length > 0) {
            results.push(`@${name}`);
        }
    }
    return results;
}
