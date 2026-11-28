import { leastCommonMultipleOf } from "../utils/divisors.utils.js";

/**
 * Returns the non-negative least common multiple of two or more safe integers. The result is `undefined` when it would exceed `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * getLeastCommonMultiple({ values: [4, 6] });
 */
export function getLeastCommonMultiple(parameters: {
    values: readonly number[];
}): number | undefined {
    return leastCommonMultipleOf(parameters.values);
}
