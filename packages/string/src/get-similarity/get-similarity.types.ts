import type { SimilarityAlgorithm } from "../types/string-unit.types.js";

/**
 * Options for {@link getSimilarity}.
 *
 * Scores are from 0 to 1 and use graphemes.
 */
export interface GetSimilarityOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
    /**
     * Which score to return.
     *
     * `"normalized-levenshtein"` is `1 - distance / max(length, length)`.
     * Two empty strings score 1 for every algorithm.
     *
     * @defaultValue `"jaro-winkler"`
     */
    algorithm?: SimilarityAlgorithm;
}
