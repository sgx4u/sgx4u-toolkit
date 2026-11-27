/**
 * Reports whether a bigint is inside the safe integer range.
 *
 * @example
 * isSafeNumberBigInt(1n);
 */
export function isSafeNumberBigInt(value: bigint): boolean {
    return (
        value <= BigInt(Number.MAX_SAFE_INTEGER) &&
        value >= BigInt(Number.MIN_SAFE_INTEGER)
    );
}
