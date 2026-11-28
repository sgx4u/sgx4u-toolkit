import { splitIntoUnits } from "../utils/units.utils.js";

/**
 * Returns the longest shared grapheme prefix of `values`.
 *
 * An empty list, or a list with a non-string, returns `undefined`.
 * No shared prefix returns `""`. A prefix never ends inside a grapheme.
 * The input array is not changed.
 *
 * @param values - The strings to compare.
 * @returns The prefix, `""`, or `undefined`.
 * @example
 * getLongestCommonPrefix(["flower", "flow"]);
 */
export function getLongestCommonPrefix(
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
            first[shared] === units[shared]
        ) {
            shared += 1;
        }
        count = shared;
    }
    return first.slice(0, count).join("");
}
