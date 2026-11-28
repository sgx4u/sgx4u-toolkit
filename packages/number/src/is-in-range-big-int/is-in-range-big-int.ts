/**
 * Reports whether a bigint lies in a half-open range by default.
 *
 * @example
 * isInRangeBigInt({ value: 1n, start: 0n, end: 2n });
 */
export function isInRangeBigInt(parameters: {
    value: bigint;
    start: bigint;
    end: bigint;
    includeStart?: boolean;
    includeEnd?: boolean;
}): boolean {
    const {
        value,
        start,
        end,
        includeStart = true,
        includeEnd = false,
    } = parameters;
    const afterStart = includeStart ? value >= start : value > start;
    const beforeEnd = includeEnd ? value <= end : value < end;
    return afterStart && beforeEnd;
}
