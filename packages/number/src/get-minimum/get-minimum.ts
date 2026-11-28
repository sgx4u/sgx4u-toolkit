/**
 * Returns the smallest finite number in `values`. Any non-finite value, or an empty list, returns `undefined`.
 *
 * @example
 * getMinimum([3, 1, 2]);
 */
export function getMinimum(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    let minimum = values[0];
    if (minimum === undefined || !Number.isFinite(minimum)) {
        return undefined;
    }
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        if (
            value < minimum ||
            (value === 0 && Object.is(value, -0) && minimum === 0)
        ) {
            minimum = value;
        }
    }
    return minimum;
}
