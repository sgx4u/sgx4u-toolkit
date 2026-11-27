import { leastCommonMultipleOfBigInt } from "../utils/divisors.utils.js";

/**
 * Returns the non-negative least common multiple of two or more bigints.
 *
 * @example
 * getLeastCommonMultipleBigInt({ values: [4n, 6n] });
 */
export function getLeastCommonMultipleBigInt(parameters: {
    values: readonly bigint[];
}): bigint | undefined {
    return leastCommonMultipleOfBigInt(parameters.values);
}
