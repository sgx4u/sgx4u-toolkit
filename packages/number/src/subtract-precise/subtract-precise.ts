import { subtractDecimal } from "../utils/decimal-arithmetic.utils.js";

/**
 * Subtracts two decimal values. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.
 *
 * @example
 * subtractPrecise({ first: 0.3, second: 0.1 });
 */
export function subtractPrecise(parameters: {
    first: number;
    second: number;
}): number | undefined {
    return subtractDecimal(parameters.first, parameters.second);
}
