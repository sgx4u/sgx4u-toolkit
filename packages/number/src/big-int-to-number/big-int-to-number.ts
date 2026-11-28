/**
 * Converts a bigint to a number when it is inside the safe integer range.
 *
 * @example
 * bigIntToNumber(12n);
 */
export function bigIntToNumber(value: bigint): number | undefined {
    if (
        value > BigInt(Number.MAX_SAFE_INTEGER) ||
        value < BigInt(Number.MIN_SAFE_INTEGER)
    ) {
        return undefined;
    }
    return Number(value);
}
