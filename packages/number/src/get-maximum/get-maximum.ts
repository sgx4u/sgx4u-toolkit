/**
 * Returns the largest finite number in `values`. Any non-finite value, or an empty list, returns `undefined`.
 *
 * @example
 * getMaximum([3, 1, 2]);
 */
export function getMaximum(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return undefined;
    }
    let maximum = values[0];
    if (maximum === undefined || !Number.isFinite(maximum)) {
        return undefined;
    }
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        if (value > maximum || (Object.is(maximum, -0) && value === 0)) {
            maximum = value;
        }
    }
    return maximum;
}
