/**
 * Replaces a floating-point artifact such as `0.30000000000000004` with the nearby short decimal. Values that are already the intended representation stay unchanged.
 *
 * @example
 * stripImpreciseRemainder(0.1 + 0.2);
 */
export function stripImpreciseRemainder(value: number): number | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (Object.is(value, -0)) {
        return -0;
    }
    const candidate = Number(value.toPrecision(12));
    if (!Number.isFinite(candidate) || candidate === value) {
        return value;
    }
    const difference = Math.abs(value - candidate);
    const scale = Math.max(Math.abs(value), Math.abs(candidate), 1);
    if (difference <= scale * Number.EPSILON * 32) {
        return candidate;
    }
    return value;
}
