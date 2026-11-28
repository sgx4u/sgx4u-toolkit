import { addDecimal } from "../utils/decimal-arithmetic.utils.js";

/**
 * Adds two decimal values so that `0.1 + 0.2` is `0.3`. Very large magnitudes or very long fractional parts can still be unrepresentable as a number.
 *
 * @example
 * addPrecise({ first: 0.1, second: 0.2 });
 */
export function addPrecise(parameters: {
    first: number;
    second: number;
}): number | undefined {
    return addDecimal(parameters.first, parameters.second);
}
