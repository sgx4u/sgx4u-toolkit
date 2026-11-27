import { greatestCommonDivisorOfBigInt } from "../utils/divisors.utils.js";

/**
 * Returns the non-negative greatest common divisor of two or more bigints.
 *
 * @example
 * getGreatestCommonDivisorBigInt({ values: [12n, 18n] });
 */
export function getGreatestCommonDivisorBigInt(parameters: {
    values: readonly bigint[];
}): bigint | undefined {
    return greatestCommonDivisorOfBigInt(parameters.values);
}
