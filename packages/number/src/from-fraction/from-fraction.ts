import { divideDecimal } from "../utils/decimal-arithmetic.utils.js";

/**
 * Divides a numerator by a denominator. A denominator of zero returns `undefined`.
 *
 * @example
 * fromFraction({ numerator: 1, denominator: 4 });
 */
export function fromFraction(parameters: {
    numerator: number;
    denominator: number;
}): number | undefined {
    if (
        !Number.isFinite(parameters.numerator) ||
        !Number.isFinite(parameters.denominator) ||
        parameters.denominator === 0
    ) {
        return undefined;
    }
    return divideDecimal(parameters.numerator, parameters.denominator);
}
