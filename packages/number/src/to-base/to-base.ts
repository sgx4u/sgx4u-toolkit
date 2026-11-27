import { digitsFromInteger } from "../utils/base-digits.utils.js";

/**
 * Converts an integer to digits in a base from 2 to 36. A bigint keeps full precision. A number outside the safe integer range returns `undefined`.
 *
 * @throws {@link RangeError} When `base` is outside 2 to 36 or `minimumDigits` is not a positive integer.
 *
 * @example
 * toBase({ value: 255, base: 16, prefix: true });
 */
export function toBase(parameters: {
    value: number | bigint;
    base: number;
    prefix?: boolean;
    minimumDigits?: number;
}): string | undefined {
    return digitsFromInteger(
        parameters.value,
        parameters.base,
        parameters.prefix ?? false,
        parameters.minimumDigits ?? 1,
    );
}
