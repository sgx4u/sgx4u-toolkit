import type { Fraction } from "../types/fraction.types.js";

/**
 * Continued-fraction approximation of `value` within `maximumDenominator`.
 */
export function approximateFraction(
    value: number,
    maximumDenominator: number,
): Fraction | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (!Number.isInteger(maximumDenominator) || maximumDenominator < 1) {
        return undefined;
    }
    if (!Number.isSafeInteger(maximumDenominator)) {
        return undefined;
    }
    const sign = value < 0 ? -1 : 1;
    let remainder = Math.abs(value);
    let previousNumerator = 1;
    let numerator = Math.floor(remainder);
    let previousDenominator = 0;
    let denominator = 1;
    if (denominator > maximumDenominator) {
        return undefined;
    }
    const fractional = remainder - numerator;
    if (fractional < 1e-12) {
        return safeFraction(sign * numerator, denominator);
    }
    remainder = 1 / fractional;
    while (Number.isFinite(remainder)) {
        const whole = Math.floor(remainder);
        const nextNumerator = whole * numerator + previousNumerator;
        const nextDenominator = whole * denominator + previousDenominator;
        if (nextDenominator > maximumDenominator) {
            break;
        }
        previousNumerator = numerator;
        numerator = nextNumerator;
        previousDenominator = denominator;
        denominator = nextDenominator;
        const nextFractional = remainder - whole;
        if (nextFractional < 1e-12) {
            break;
        }
        remainder = 1 / nextFractional;
    }
    return safeFraction(sign * numerator, denominator === 0 ? 1 : denominator);
}

function safeFraction(
    numerator: number,
    denominator: number,
): Fraction | undefined {
    if (
        !Number.isSafeInteger(numerator) ||
        !Number.isSafeInteger(denominator)
    ) {
        return undefined;
    }
    return { numerator, denominator };
}
