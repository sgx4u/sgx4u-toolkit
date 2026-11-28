import { nextPowerOfTwoValue } from "../utils/float-bits.utils.js";

/**
 * Returns the smallest power of two that is greater than or equal to a positive finite `value`.
 *
 * @example
 * getNextPowerOfTwo(5);
 */
export function getNextPowerOfTwo(value: number): number | undefined {
    return nextPowerOfTwoValue(value);
}
