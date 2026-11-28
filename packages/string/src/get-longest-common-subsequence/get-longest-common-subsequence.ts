import { longestCommonSubsequence } from "../utils/distance.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { StringUnit } from "../types/string-unit.types.js";
import type { GetLongestCommonSubsequenceOptions } from "./get-longest-common-subsequence.types.js";

/**
 * Returns the longest common subsequence of two strings.
 *
 * The match does not have to be contiguous. When several subsequences
 * share the winning length, the one that appears first in `first` is
 * kept. Two empty strings return `""`. A non-string input returns
 * `undefined`. The inputs are not changed.
 *
 * @param options - The two strings and an optional unit.
 * @returns The subsequence, or `undefined` when either input is not a string.
 * @throws {@link RangeError} When `unit` is not a known unit.
 * @throws {@link TypeError} When `unit` is present and is not a string.
 * @example
 * getLongestCommonSubsequence({ first: "abcde", second: "ace" });
 */
export function getLongestCommonSubsequence(
    options: GetLongestCommonSubsequenceOptions,
): string | undefined {
    const resolved = readOptionsCall(options, readDistanceOptions);
    if (resolved === undefined) {
        return undefined;
    }
    const first = resolved.record.first;
    const second = resolved.record.second;
    if (typeof first !== "string" || typeof second !== "string") {
        return undefined;
    }
    return longestCommonSubsequence(
        splitIntoUnits(first, resolved.options.unit),
        splitIntoUnits(second, resolved.options.unit),
    );
}

/**
 * @param record - The options object.
 * @returns The checked unit.
 */
function readDistanceOptions(record: Record<string, unknown>): {
    unit: StringUnit;
} {
    return { unit: readUnit(record.unit) };
}
