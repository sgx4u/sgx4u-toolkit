import { isEmail } from "../is-email/is-email.js";

/**
 * Finds email addresses in `value`.
 *
 * Each result uses the same practical rules as `isEmail`. Matches are
 * returned in order and do not share a span. Trailing sentence punctuation
 * is left off when the shorter text is still an address. An input with no
 * address returns an empty array. A non-string returns `undefined`. The
 * input is not changed.
 *
 * @param value - Any value. Only a string is scanned.
 * @returns The addresses, an empty array when there are none, or `undefined` when `value` is not a string.
 * @example
 * extractEmails("Write user@example.com today.");
 */
export function extractEmails(value: unknown): string[] | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const results: string[] = [];
    let index = 0;
    while (index < value.length) {
        const atIndex = value.indexOf("@", index);
        if (atIndex === -1) {
            break;
        }
        let start = atIndex;
        while (start > 0 && isAddressCharacter(value[start - 1] ?? "")) {
            start -= 1;
        }
        let end = atIndex + 1;
        while (end < value.length && isAddressCharacter(value[end] ?? "")) {
            end += 1;
        }
        if (start < atIndex && end > atIndex + 1) {
            const candidate = trimTrailingPunctuation(
                value.slice(start, end),
                isEmail,
            );
            if (candidate !== undefined) {
                results.push(candidate);
            }
        }
        index = Math.max(end, atIndex + 1);
    }
    return results;
}

/**
 * Whether `character` can sit in the practical address scan.
 *
 * Whitespace, `@`, and the wrapper characters end a candidate. The scan
 * walks one character at a time so a long run cannot force backtracking.
 *
 * @param character - One code unit.
 * @returns `true` when the character can belong to an address candidate.
 */
function isAddressCharacter(character: string): boolean {
    return (
        character !== "@" &&
        character !== "<" &&
        character !== ">" &&
        character !== "(" &&
        character !== ")" &&
        !/\s/u.test(character)
    );
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
