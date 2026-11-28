/**
 * Returns the smallest bigint. An empty list returns `undefined`.
 *
 * @example
 * getMinimumBigInt([3n, 1n]);
 */
export function getMinimumBigInt(
    values: readonly bigint[],
): bigint | undefined {
    if (values.length === 0) {
        return undefined;
    }
    let minimum = values[0];
    if (minimum === undefined) {
        return undefined;
    }
    for (const value of values) {
        if (value < minimum) {
            minimum = value;
        }
    }
    return minimum;
}
