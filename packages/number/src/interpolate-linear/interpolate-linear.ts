/**
 * Returns `start + (end - start) * amount`. `amount` is not clamped, so the result can leave the segment.
 *
 * @example
 * interpolateLinear({ start: 0, end: 10, amount: 0.5 });
 */
export function interpolateLinear(parameters: {
    start: number;
    end: number;
    amount: number;
}): number | undefined {
    const { start, end, amount } = parameters;
    if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        !Number.isFinite(amount)
    ) {
        return undefined;
    }
    return start + (end - start) * amount;
}
