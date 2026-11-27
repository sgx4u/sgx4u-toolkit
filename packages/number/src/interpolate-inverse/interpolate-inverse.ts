/**
 * Returns the amount that maps `start` to `end` through `value`. When all three are equal the result is `0`.
 *
 * @example
 * interpolateInverse({ start: 0, end: 10, value: 5 });
 */
export function interpolateInverse(parameters: {
    start: number;
    end: number;
    value: number;
}): number | undefined {
    const { start, end, value } = parameters;
    if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        !Number.isFinite(value)
    ) {
        return undefined;
    }
    if (start === end) {
        return value === start ? 0 : undefined;
    }
    return (value - start) / (end - start);
}
