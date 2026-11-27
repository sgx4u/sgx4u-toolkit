import type { Fraction } from "../types/fraction.types.js";
import { approximateFraction } from "../utils/fraction.utils.js";

/**
 * Approximates `value` with a continued fraction whose denominator is at most `maximumDenominator`.
 *
 * @example
 * toFraction({ value: 0.5 });
 */
export function toFraction(parameters: {
    value: number;
    maximumDenominator?: number;
}): Fraction | undefined {
    return approximateFraction(
        parameters.value,
        parameters.maximumDenominator ?? 10000,
    );
}
