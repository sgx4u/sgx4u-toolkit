/**
 * Reports whether `value` lies in the range. The range is half-open `[start, end)` unless `includeStart` or `includeEnd` says otherwise.
 *
 * @example
 * isInRange({ value: 1, start: 0, end: 2 });
 */
export function isInRange(parameters: {
    value: number;
    start: number;
    end: number;
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
    if (
        !Number.isFinite(value) ||
        !Number.isFinite(start) ||
        !Number.isFinite(end)
    ) {
        return false;
    }
    const afterStart = includeStart ? value >= start : value > start;
    const beforeEnd = includeEnd ? value <= end : value < end;
    return afterStart && beforeEnd;
}
