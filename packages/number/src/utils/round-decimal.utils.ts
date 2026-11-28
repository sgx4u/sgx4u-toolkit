import { maximumPrecisionMagnitude } from "../constants/number-defaults.constants.js";
import { roundingModes } from "../constants/rounding-modes.constants.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import { readFloatComponents } from "./float-bits.utils.js";

const roundingModeSet: ReadonlySet<string> = new Set(roundingModes);

/**
 * Throws when `mode` is not a rounding mode.
 *
 * @param mode - Candidate mode.
 * @param argumentName - Parameter name written into the error.
 */
export function assertRoundingMode(
    mode: string,
    argumentName: string,
): asserts mode is RoundingMode {
    if (!roundingModeSet.has(mode)) {
        throw new RangeError(
            `${argumentName} must be a rounding mode. Received ${JSON.stringify(mode)}.`,
        );
    }
}

/**
 * Throws when `precision` is not an integer in the supported magnitude.
 *
 * @param precision - Candidate number of decimal places. Negative values round to powers of ten.
 * @param argumentName - Parameter name written into the error.
 */
export function assertPrecision(precision: number, argumentName: string): void {
    if (
        !Number.isInteger(precision) ||
        Math.abs(precision) > maximumPrecisionMagnitude
    ) {
        throw new RangeError(
            `${argumentName} must be an integer from -${String(maximumPrecisionMagnitude)} to ${String(maximumPrecisionMagnitude)}. Received ${String(precision)}.`,
        );
    }
}

/**
 * Rounds `value` to `precision` decimal places with `mode`.
 *
 * The decision uses the exact rational value of the double. The returned
 * number is the double nearest to that decimal result. Non-finite input
 * returns `undefined`. A result of magnitude zero keeps the sign of `value`.
 */
export function roundDecimal(
    value: number,
    precision: number,
    mode: RoundingMode,
): number | undefined {
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (value === 0) {
        return value;
    }
    const components = readFloatComponents(value);
    const scaled = scaleToInteger(
        components.significand,
        components.exponent,
        precision,
    );
    const quotient = scaled.numerator / scaled.denominator;
    const remainder = scaled.numerator % scaled.denominator;
    const increment = incrementsMagnitude(
        mode,
        components.sign,
        quotient,
        remainder,
        scaled.denominator,
    );
    const magnitude = quotient + (increment ? 1n : 0n);
    if (magnitude === 0n) {
        return components.sign === -1 ? -0 : 0;
    }
    return scaledIntegerToNumber(
        components.sign === -1 ? -magnitude : magnitude,
        precision,
    );
}

/**
 * Exact value of `significand * 2^binaryExponent * 10^precision` as a ratio.
 */
function scaleToInteger(
    significand: bigint,
    binaryExponent: number,
    precision: number,
): { numerator: bigint; denominator: bigint } {
    if (precision >= 0) {
        const power = binaryExponent + precision;
        const fivePower = 5n ** BigInt(precision);
        if (power >= 0) {
            return {
                numerator: significand * fivePower * 2n ** BigInt(power),
                denominator: 1n,
            };
        }
        return {
            numerator: significand * fivePower,
            denominator: 2n ** BigInt(-power),
        };
    }
    const places = -precision;
    const fivePower = 5n ** BigInt(places);
    const power = binaryExponent - places;
    if (power >= 0) {
        return {
            numerator: significand * 2n ** BigInt(power),
            denominator: fivePower,
        };
    }
    return {
        numerator: significand,
        denominator: fivePower * 2n ** BigInt(-power),
    };
}

/**
 * Whether the absolute quotient should move one step away from zero.
 */
function incrementsMagnitude(
    mode: RoundingMode,
    sign: 1 | -1,
    quotient: bigint,
    remainder: bigint,
    denominator: bigint,
): boolean {
    if (remainder === 0n || mode === "trunc") {
        return false;
    }
    if (mode === "expand") {
        return true;
    }
    if (mode === "floor") {
        return sign === -1;
    }
    if (mode === "ceil") {
        return sign === 1;
    }
    const doubled = remainder * 2n;
    if (doubled < denominator) {
        return false;
    }
    if (doubled > denominator) {
        return true;
    }
    if (mode === "halfTrunc") {
        return false;
    }
    if (mode === "halfExpand") {
        return true;
    }
    if (mode === "halfCeil") {
        return sign === 1;
    }
    if (mode === "halfFloor") {
        return sign === -1;
    }
    return quotient % 2n !== 0n;
}

/**
 * Converts an integer that already represents `precision` decimal places.
 */
function scaledIntegerToNumber(
    scaled: bigint,
    precision: number,
): number | undefined {
    const negative = scaled < 0n;
    const digits = (negative ? -scaled : scaled).toString();
    let text: string;
    if (precision > 0) {
        const padded = digits.padStart(precision + 1, "0");
        const pointIndex = padded.length - precision;
        text = `${padded.slice(0, pointIndex)}.${padded.slice(pointIndex)}`;
    } else if (precision < 0) {
        text = `${digits}${"0".repeat(-precision)}`;
    } else {
        text = digits;
    }
    const parsed = Number(`${negative ? "-" : ""}${text}`);
    if (!Number.isFinite(parsed)) {
        return undefined;
    }
    return parsed;
}
