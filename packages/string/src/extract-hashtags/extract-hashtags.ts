/**
 * Finds hashtags in `value`.
 *
 * A hashtag is `#` plus letters or digits. The `#` is included in the
 * result. A second `#` in `##tag` does not start a tag. Matches are
 * returned in order and do not share a span. An input with no hashtag
 * returns an empty array. A non-string returns `undefined`. The input
 * is not changed.
 *
 * @param value - Any value. Only a string is scanned.
 * @returns The hashtags, an empty array when there are none, or `undefined` when `value` is not a string.
 * @example
 * extractHashtags("Ship #release1");
 */
export function extractHashtags(value: unknown): string[] | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const results: string[] = [];
    for (const match of value.matchAll(/(?<!#)#([\p{L}\p{N}]+)/gu)) {
        const name = match[1];
        if (name !== undefined && name.length > 0) {
            results.push(`#${name}`);
        }
    }
    return results;
}
