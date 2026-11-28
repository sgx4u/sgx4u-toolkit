import { readOptionsCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { GetLongestCommonSubstringOptions } from "./get-longest-common-substring.types.js";

/**
 * Returns the longest contiguous shared substring.
 *
 * The substring is a run of whole graphemes. Ties keep the first
 * occurrence in `first`. No shared substring returns `""`. A non-string
 * returns `undefined`. The inputs are not changed.
 *
 * @param options - `first` and `second`.
 * @returns The substring, `""`, or `undefined`.
 * @example
 * getLongestCommonSubstring({ first: "abcd", second: "bc" });
 */
export function getLongestCommonSubstring(
    options: GetLongestCommonSubstringOptions,
): string | undefined {
    const resolved = readOptionsCall(options, () => ({}));
    if (
        resolved === undefined ||
        typeof resolved.record.first !== "string" ||
        typeof resolved.record.second !== "string"
    ) {
        return undefined;
    }
    const firstUnits = splitIntoUnits(resolved.record.first, "grapheme");
    const secondUnits = splitIntoUnits(resolved.record.second, "grapheme");
    let bestStart = 0;
    let bestLength = 0;
    for (let start = 0; start < firstUnits.length; start += 1) {
        const room = firstUnits.length - start;
        for (let length = bestLength + 1; length <= room; length += 1) {
            const candidate = firstUnits.slice(start, start + length);
            if (!containsUnits(secondUnits, candidate)) {
                break;
            }
            bestStart = start;
            bestLength = length;
        }
    }
    return firstUnits.slice(bestStart, bestStart + bestLength).join("");
}

/**
 * Whether `units` contains `candidate` as a contiguous run.
 *
 * @param units - The text to search, already split into graphemes.
 * @param candidate - The graphemes to find.
 * @returns `true` when the run occurs.
 */
function containsUnits(
    units: readonly string[],
    candidate: readonly string[],
): boolean {
    if (candidate.length === 0) {
        return true;
    }
    const lastStart = units.length - candidate.length;
    for (let index = 0; index <= lastStart; index += 1) {
        let matches = true;
        for (let offset = 0; offset < candidate.length; offset += 1) {
            if (units[index + offset] !== candidate[offset]) {
                matches = false;
                break;
            }
        }
        if (matches) {
            return true;
        }
    }
    return false;
}
