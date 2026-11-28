/**
 * Truncating division of two finite numbers.
 *
 * `quotient` is toward zero. `remainder` matches the JavaScript `%`
 * operator, so it can be negative.
 */
export interface QuotientAndRemainder {
    /** Toward-zero count of how many times the divisor fits. */
    quotient: number;
    /** What is left after that count. Zero when the division is exact. */
    remainder: number;
}
