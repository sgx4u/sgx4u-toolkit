/**
 * Copies `words` without repeating a string that already appeared.
 *
 * The first spelling wins. The input array is left unchanged.
 *
 * @param words - Strings to copy, in order.
 * @returns A new array.
 */
export function uniqueStrings(words: readonly string[]): string[] {
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const word of words) {
        if (seen.has(word)) {
            continue;
        }
        seen.add(word);
        unique.push(word);
    }
    return unique;
}
