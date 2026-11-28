import { splitIntoUnits } from "../utils/units.utils.js";

/**
 * Returns the longest shared grapheme suffix of `values`.
 *
 * An empty list, or a list with a non-string, returns `undefined`.
 * No shared suffix returns `""`. A suffix never starts inside a grapheme.
 * The input array is not changed.
 *
 * @param values - The strings to compare.
 * @returns The suffix, `""`, or `undefined`.
 * @example
 * getLongestCommonSuffix(["testing", "running"]);
 */
export function getLongestCommonSuffix(
    values: readonly string[],
): string | undefined {
    if (!Array.isArray(values) || values.length === 0) {
        return undefined;
    }
    const lists: string[][] = [];
    for (const value of values) {
        if (typeof value !== "string") {
            return undefined;
        }
        lists.push(splitIntoUnits(value, "grapheme"));
    }
    const first = lists[0] ?? [];
    let count = first.length;
    for (const units of lists.slice(1)) {
        let shared = 0;
        while (
            shared < count &&
            shared < units.length &&
            first[first.length - 1 - shared] ===
                units[units.length - 1 - shared]
        ) {
            shared += 1;
        }
        count = shared;
    }
    return first.slice(first.length - count).join("");
}
