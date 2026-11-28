import { isPowerOfTwoValue } from "../utils/float-bits.utils.js";

/**
 * Reports whether `value` is an integer power of two and at least 1.
 *
 * @example
 * isPowerOfTwo(8);
 */
export function isPowerOfTwo(value: unknown): boolean {
    return isPowerOfTwoValue(value);
}
