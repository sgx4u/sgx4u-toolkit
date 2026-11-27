import { greatestCommonDivisorOf } from "../utils/divisors.utils.js";

/**
 * Returns the non-negative greatest common divisor of two or more safe integers.
 *
 * @example
 * getGreatestCommonDivisor({ values: [12, 18, 30] });
 */
export function getGreatestCommonDivisor(parameters: {
    values: readonly number[];
}): number | undefined {
    return greatestCommonDivisorOf(parameters.values);
}
