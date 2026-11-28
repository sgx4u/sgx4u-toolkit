/**
 * Options for {@link getJaroWinklerSimilarity}.
 *
 * The score is from 0 to 1. Comparison uses graphemes.
 */
export interface GetJaroWinklerSimilarityOptions {
    /** The first string. */
    first: string;
    /** The second string. */
    second: string;
}
