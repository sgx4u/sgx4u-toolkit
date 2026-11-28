import { divideDecimal } from "../utils/decimal-arithmetic.utils.js";

/**
 * Divides two decimal values. A divisor of `0` or `-0` returns `undefined`. A repeating result is rounded to 15 fractional digits, ties away from zero.
 *
 * @example
 * dividePrecise({ first: 1, second: 2 });
 */
export function dividePrecise(parameters: {
    first: number;
    second: number;
}): number | undefined {
    return divideDecimal(parameters.first, parameters.second);
}
