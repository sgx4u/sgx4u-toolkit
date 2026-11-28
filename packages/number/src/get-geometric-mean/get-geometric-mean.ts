/**
 * Returns the geometric mean. Any value that is not a positive finite number returns `undefined`.
 *
 * @example
 * getGeometricMean([1, 4]);
 */
export function getGeometricMean(
    values: readonly number[],
): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    let logTotal = 0;
    for (const value of values) {
        if (!Number.isFinite(value) || value <= 0) {
            return undefined;
        }
        logTotal += Math.log(value);
    }
    return Math.exp(logTotal / values.length);
}
