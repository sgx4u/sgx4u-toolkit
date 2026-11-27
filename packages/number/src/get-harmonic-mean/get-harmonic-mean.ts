/**
 * Returns the harmonic mean. An empty list, a zero, or a set whose reciprocals cancel returns `undefined`.
 *
 * @example
 * getHarmonicMean([1, 2]);
 */
export function getHarmonicMean(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    let reciprocalTotal = 0;
    for (const value of values) {
        if (!Number.isFinite(value) || value === 0) {
            return undefined;
        }
        reciprocalTotal += 1 / value;
    }
    const mean = values.length / reciprocalTotal;
    return Number.isFinite(mean) ? mean : undefined;
}
