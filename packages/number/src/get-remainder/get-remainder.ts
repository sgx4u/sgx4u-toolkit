/**
 * Returns the JavaScript remainder. A divisor of `0` or `-0` returns `undefined`.
 *
 * @example
 * getRemainder({ dividend: 5, divisor: 2 });
 */
export function getRemainder(parameters: {
    dividend: number;
    divisor: number;
}): number | undefined {
    const { dividend, divisor } = parameters;
    if (
        !Number.isFinite(dividend) ||
        !Number.isFinite(divisor) ||
        divisor === 0
    ) {
        return undefined;
    }
    return dividend % divisor;
}
