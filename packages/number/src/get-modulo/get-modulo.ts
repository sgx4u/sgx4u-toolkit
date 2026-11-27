/**
 * Returns a non-negative remainder for a non-zero divisor. A divisor of zero returns `undefined`.
 *
 * @example
 * getModulo({ dividend: -5, divisor: 2 });
 */
export function getModulo(parameters: {
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
    const remainder = dividend % divisor;
    return remainder < 0 ? remainder + Math.abs(divisor) : remainder;
}
