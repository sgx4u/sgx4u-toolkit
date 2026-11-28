import {
    diceCoefficient,
    jaroWinklerSimilarity,
    normalizedLevenshteinSimilarity,
} from "../utils/distance.utils.js";
import { readEnum } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { SimilarityAlgorithm } from "../types/string-unit.types.js";
import type { GetSimilarityOptions } from "./get-similarity.types.js";

const similarityAlgorithms = [
    "jaro-winkler",
    "dice",
    "normalized-levenshtein",
] as const;

/**
 * Returns a similarity score from 0 to 1.
 *
 * Units are graphemes. `"jaro-winkler"` is the default. `"dice"` is the
 * Sørensen–Dice coefficient. `"normalized-levenshtein"` is
 * `1 - distance / max(length, length)`. Two empty strings score 1. A
 * non-string input returns `undefined`. The inputs are not changed.
 *
 * @param options - The two strings and an optional algorithm.
 * @returns The score, or `undefined` when either input is not a string.
 * @throws {@link RangeError} When `algorithm` is not a known algorithm.
 * @throws {@link TypeError} When `algorithm` is present and is not a string.
 * @example
 * getSimilarity({ first: "kitten", second: "sitting" });
 */
export function getSimilarity(
    options: GetSimilarityOptions,
): number | undefined {
    const resolved = readOptionsCall(options, readSimilarityOptions);
    if (resolved === undefined) {
        return undefined;
    }
    const first = resolved.record.first;
    const second = resolved.record.second;
    if (typeof first !== "string" || typeof second !== "string") {
        return undefined;
    }
    return scoreUnits(
        splitIntoUnits(first, "grapheme"),
        splitIntoUnits(second, "grapheme"),
        resolved.options.algorithm,
    );
}

/**
 * @param record - The options object.
 * @returns The checked algorithm.
 */
function readSimilarityOptions(record: Record<string, unknown>): {
    algorithm: SimilarityAlgorithm;
} {
    return {
        algorithm: readEnum(
            "algorithm",
            record.algorithm,
            similarityAlgorithms,
            "jaro-winkler",
        ),
    };
}

/**
 * @param left - Graphemes of the first string.
 * @param right - Graphemes of the second string.
 * @param algorithm - The selected score.
 * @returns The score from 0 to 1.
 */
function scoreUnits(
    left: readonly string[],
    right: readonly string[],
    algorithm: SimilarityAlgorithm,
): number {
    if (algorithm === "dice") {
        return diceCoefficient(left, right);
    }
    if (algorithm === "normalized-levenshtein") {
        return normalizedLevenshteinSimilarity(left, right);
    }
    return jaroWinklerSimilarity(left, right);
}
