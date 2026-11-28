/**
 * Interpolates with the Hermite smoothstep curve after clamping `amount` to `[0, 1]`.
 *
 * @example
 * interpolateSmoothstep({ start: 0, end: 10, amount: 0.5 });
 */
export function interpolateSmoothstep(parameters: {
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
    const clamped = Math.min(1, Math.max(0, amount));
    const curved = clamped * clamped * (3 - 2 * clamped);
    return start + (end - start) * curved;
}
