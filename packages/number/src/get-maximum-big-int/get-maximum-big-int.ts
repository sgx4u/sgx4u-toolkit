/**
 * Returns the largest bigint. An empty list returns `undefined`.
 *
 * @example
 * getMaximumBigInt([3n, 1n]);
 */
export function getMaximumBigInt(
    values: readonly bigint[],
): bigint | undefined {
    if (values.length === 0) {
        return undefined;
    }
    let maximum = values[0];
    if (maximum === undefined) {
        return undefined;
    }
    for (const value of values) {
        if (value > maximum) {
            maximum = value;
        }
    }
    return maximum;
}
