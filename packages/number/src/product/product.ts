/**
 * Multiplies finite numbers. An empty list is `1`.
 *
 * @example
 * product([2, 3, 4]);
 */
export function product(values: readonly number[]): number | undefined {
    if (values.length === 0) {
        return 1;
    }
    let result = 1;
    for (const value of values) {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        result *= value;
    }
    return result;
}
