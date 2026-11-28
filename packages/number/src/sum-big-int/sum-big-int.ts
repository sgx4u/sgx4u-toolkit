/**
 * Sums bigints. An empty list is `0n`.
 *
 * @example
 * sumBigInt([1n, 2n]);
 */
export function sumBigInt(values: readonly bigint[]): bigint {
    let total = 0n;
    for (const value of values) {
        total += value;
    }
    return total;
}
