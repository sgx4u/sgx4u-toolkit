/**
 * Returns the median of a copy of `values`. The input is not mutated. An empty list or a non-finite value returns `undefined`.
 *
 * @example
 * median([1, 100, 3]);
 */
export function median(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
    }
    const sorted = [...values].sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    const upper = sorted[middle];
    if (sorted.length % 2 === 1) {
        return upper;
    }
    const lower = sorted[middle - 1];
    if (lower === undefined || upper === undefined) {
        return undefined;
    }
    return (lower + upper) / 2;
}
