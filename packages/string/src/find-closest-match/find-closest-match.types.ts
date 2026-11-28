import type { SimilarityAlgorithm } from "../types/string-unit.types.js";

/**
 * Options for {@link findClosestMatch}.
 *
 * The highest score wins. An earlier candidate wins a tie.
 */
export interface FindClosestMatchOptions {
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
     * A score equal to `minimumScore` is still eligible. `0` keeps every
     * finite score.
     *
     * @defaultValue 0
     */
    minimumScore?: number;
}
