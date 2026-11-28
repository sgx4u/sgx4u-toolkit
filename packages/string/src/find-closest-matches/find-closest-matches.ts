import {
    readEnum,
    readFiniteNumber,
    readInteger,
} from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type {
    ClosestMatch,
    SimilarityAlgorithm,
} from "../types/string-unit.types.js";
import { getSimilarity } from "../get-similarity/get-similarity.js";
import type { FindClosestMatchesOptions } from "./find-closest-matches.types.js";

const similarityAlgorithms = [
    "jaro-winkler",
    "dice",
    "normalized-levenshtein",
] as const;

/**
 * Settings after checks have been applied.
 */
interface FindClosestMatchesSettings {
    /** The ranking algorithm. */
    algorithm: SimilarityAlgorithm;
    /** Scores below this value are skipped. */
    minimumScore: number;
    /** How many matches to keep. */
    limit: number;
    /** The candidate list. Entries that are not strings are skipped. */
    candidates: readonly unknown[];
}

/**
 * Returns the closest candidates, best first.
 *
 * An empty candidate list returns an empty array. A score below
 * `minimumScore` is skipped. Candidates that are not strings are skipped.
 * A tie keeps the earlier candidate first. A non-string `value` returns
 * `undefined`. The candidate list is not changed.
 *
 * @param options - The text, the candidates, and the optional score settings.
 * @returns The matches, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `candidates` is not an array, or a number option has the wrong type.
 * @throws {@link RangeError} When `algorithm` is unknown, `minimumScore` is not finite, or `limit` is negative or not an integer.
 * @example
 * findClosestMatches({ value: "cat", candidates: ["car", "dog", "cot"], limit: 2 });
 */
export function findClosestMatches(
    options: FindClosestMatchesOptions,
): ClosestMatch[] | undefined {
    const resolved = readOptionsCall(options, readFindClosestMatchesOptions);
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return selectClosest(
        resolved.record.value,
        resolved.options.candidates,
        resolved.options.algorithm,
        resolved.options.minimumScore,
        resolved.options.limit,
    );
}

/**
 * @param record - The options object.
 * @returns Checked search settings.
 */
function readFindClosestMatchesOptions(
    record: Record<string, unknown>,
): FindClosestMatchesSettings {
    return {
        algorithm: readEnum(
            "algorithm",
            record.algorithm,
            similarityAlgorithms,
            "jaro-winkler",
        ),
        minimumScore: readFiniteNumber("minimumScore", record.minimumScore, 0),
        limit: readInteger("limit", record.limit, 0, undefined, 5),
        candidates: readCandidates(record.candidates),
    };
}

/**
 * @param value - The `candidates` option.
 * @returns The same array. It is not copied and not changed.
 */
function readCandidates(value: unknown): readonly unknown[] {
    if (!Array.isArray(value)) {
        throw new TypeError(
            `candidates must be an array. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * @param value - The text being matched.
 * @param candidates - The candidate list. It is not changed.
 * @param algorithm - The score to use.
 * @param minimumScore - The lowest score that still qualifies.
 * @param limit - How many matches to keep.
 * @returns A new array, best first.
 */
function selectClosest(
    value: string,
    candidates: readonly unknown[],
    algorithm: SimilarityAlgorithm,
    minimumScore: number,
    limit: number,
): ClosestMatch[] {
    const matches: ClosestMatch[] = [];
    for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        if (typeof candidate !== "string") {
            continue;
        }
        const score = getSimilarity({
            first: value,
            second: candidate,
            algorithm,
        });
        if (score === undefined || score < minimumScore) {
            continue;
        }
        matches.push({ value: candidate, index, score });
    }
    matches.sort((left, right) => {
        if (left.score !== right.score) {
            return right.score - left.score;
        }
        return left.index - right.index;
    });
    return matches.slice(0, limit);
}
