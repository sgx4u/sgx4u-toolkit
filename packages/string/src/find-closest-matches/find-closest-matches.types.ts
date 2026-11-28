import type { SimilarityAlgorithm } from "../types/string-unit.types.js";

/**
 * Options for {@link findClosestMatches}.
 *
 * Results are best first. An earlier candidate wins a tie.
 */
export interface FindClosestMatchesOptions {
    /** The text to compare with each candidate. */
    value: string;
    /** Candidates in the order they should break ties. */
    candidates: readonly string[];
    /**
     * The score used to rank candidates.
     *
     * @defaultValue `"jaro-winkler"`
     */
    algorithm?: SimilarityAlgorithm;
    /**
     * Scores strictly below this number are skipped.
     *
     * @defaultValue 0
     */
    minimumScore?: number;
    /**
     * How many matches to return.
     *
     * `0` returns an empty array. A negative number is rejected.
     *
     * @defaultValue 5
     */
    limit?: number;
}
