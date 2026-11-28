/**
 * A ratio of two finite numbers.
 *
 * `denominator` is not zero for a fraction returned by this package.
 */
export interface Fraction {
    /** Signed count of parts. */
    numerator: number;
    /** Size of one part. Never zero on a returned fraction. */
    denominator: number;
}
