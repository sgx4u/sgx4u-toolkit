import { multiplyDecimal } from "../utils/decimal-arithmetic.utils.js";

/**
 * Multiplies two decimal values. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.
 *
 * @example
 * multiplyPrecise({ first: 0.1, second: 0.2 });
 */
export function multiplyPrecise(parameters: {
    first: number;
    second: number;
}): number | undefined {
    return multiplyDecimal(parameters.first, parameters.second);
}
