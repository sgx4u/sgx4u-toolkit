import { integerFromDigits } from "../utils/base-digits.utils.js";

/**
 * Parses digits in a base from 2 to 36. A safe integer is a number. A larger integer is a bigint.
 *
 * @throws {@link RangeError} When `base` is outside 2 to 36.
 *
 * @example
 * fromBase({ value: "ff", base: 16 });
 */
export function fromBase(parameters: {
    value: string;
    base: number;
}): number | bigint | undefined {
    return integerFromDigits(parameters.value, parameters.base);
}
