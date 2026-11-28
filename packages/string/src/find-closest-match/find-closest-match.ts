import { readEnum, readFiniteNumber } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type {
    ClosestMatch,
    SimilarityAlgorithm,
} from "../types/string-unit.types.js";
import { getSimilarity } from "../get-similarity/get-similarity.js";
import type { FindClosestMatchOptions } from "./find-closest-match.types.js";

const similarityAlgorithms = [
    "jaro-winkler",
    "dice",
    "normalized-levenshtein",
] as const;

/**
 * Settings after checks have been applied.
 */
interface FindClosestMatchSettings {
    /** The ranking algorithm. */
    algorithm: SimilarityAlgorithm;
    /** Scores below this value are skipped. */
    minimumScore: number;
    /** The candidate list. Entries that are not strings are skipped. */
    candidates: readonly unknown[];
}

/**
 * Returns the candidate closest to `value`.
 *
 * The highest score wins. When two scores are equal, the earlier candidate
 * wins. An empty candidate list returns `undefined`. A score below
 * `minimumScore` is skipped. Candidates that are not strings are skipped.
 * A non-string `value` returns `undefined`. The candidate list is not
 * changed.
 *
 * @param options - The text, the candidates, and the optional score settings.
 * @returns The winning candidate, or `undefined` when none qualifies.
 * @throws {@link TypeError} When `candidates` is not an array, or `minimumScore` is not a number.
 * @throws {@link RangeError} When `algorithm` is unknown, or `minimumScore` is not finite.
 * @example
 * findClosestMatch({ value: "cat", candidates: ["car", "dog", "cat"] });
 */
export function findClosestMatch(
    options: FindClosestMatchOptions,
): ClosestMatch | undefined {
    const resolved = readOptionsCall(options, readFindClosestMatchOptions);
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    return selectClosest(
        resolved.record.value,
        resolved.options.candidates,
        resolved.options.algorithm,
        resolved.options.minimumScore,
    );
}

/**
 * @param record - The options object.
 * @returns Checked search settings.
 */
function readFindClosestMatchOptions(
    record: Record<string, unknown>,
): FindClosestMatchSettings {
    return {
        algorithm: readEnum(
            "algorithm",
            record.algorithm,
            similarityAlgorithms,
            "jaro-winkler",
        ),
        minimumScore: readFiniteNumber("minimumScore", record.minimumScore, 0),
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
 * @param candidates - The candidate list, including non-strings that will be skipped.
 * @param algorithm - The score to use.
 * @param minimumScore - The lowest score that still qualifies.
 * @returns The best qualifying candidate, or `undefined`.
 */
function selectClosest(
    value: string,
    candidates: readonly unknown[],
    algorithm: SimilarityAlgorithm,
    minimumScore: number,
): ClosestMatch | undefined {
    let best: ClosestMatch | undefined;
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
        if (best === undefined || score > best.score) {
            best = { value: candidate, index, score };
        }
    }
    return best;
}
