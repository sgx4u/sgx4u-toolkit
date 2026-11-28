import { damerauLevenshteinDistance } from "../utils/distance.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { StringUnit } from "../types/string-unit.types.js";
import type { GetDamerauLevenshteinDistanceOptions } from "./get-damerau-levenshtein-distance.types.js";

/**
 * Returns the Damerau-Levenshtein distance between two strings.
 *
 * Insertions, deletions, and substitutions cost 1. Swapping two adjacent
 * units also costs 1, so `"ab"` and `"ba"` have distance 1. A non-string
 * input returns `undefined`. The inputs are not changed.
 *
 * @param options - The two strings and an optional unit.
 * @returns The edit distance, or `undefined` when either input is not a string.
 * @throws {@link RangeError} When `unit` is not a known unit.
 * @throws {@link TypeError} When `unit` is present and is not a string.
 * @example
 * getDamerauLevenshteinDistance({ first: "ab", second: "ba" });
 */
export function getDamerauLevenshteinDistance(
    options: GetDamerauLevenshteinDistanceOptions,
): number | undefined {
    const resolved = readOptionsCall(options, readDistanceOptions);
    if (resolved === undefined) {
        return undefined;
    }
    const first = resolved.record.first;
    const second = resolved.record.second;
    if (typeof first !== "string" || typeof second !== "string") {
        return undefined;
    }
    return damerauLevenshteinDistance(
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
