import type { QuotientAndRemainder } from "../types/quotient-and-remainder.types.js";

/**
 * Returns toward-zero quotient and the JavaScript remainder. A divisor of zero returns `undefined`.
 *
 * @example
 * getQuotientAndRemainder({ dividend: 5, divisor: 2 });
 */
export function getQuotientAndRemainder(parameters: {
    dividend: number;
    divisor: number;
}): QuotientAndRemainder | undefined {
    const { dividend, divisor } = parameters;
    if (
        !Number.isFinite(dividend) ||
        !Number.isFinite(divisor) ||
        divisor === 0
    ) {
        return undefined;
    }
    return {
        quotient: Math.trunc(dividend / divisor),
        remainder: dividend % divisor,
    };
}
