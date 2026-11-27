import type { RoundingMode } from "../types/rounding-mode.types.js";
import { defaultRoundingMode } from "../constants/number-defaults.constants.js";
import { assertRoundingMode } from "../utils/round-decimal.utils.js";
import { roundNumber } from "../round-number/round-number.js";

/**
 * Rounds `value` to `digits` significant digits. More than 17 digits returns the finite value unchanged.
 *
 * @throws {@link RangeError} When `digits` is not a positive integer or `mode` is unknown.
 *
 * @example
 * toSignificantDigits({ value: 12345, digits: 2 });
 */
export function toSignificantDigits(parameters: {
    value: number;
    digits: number;
    mode?: RoundingMode;
}): number | undefined {
    const { value, digits, mode = defaultRoundingMode } = parameters;
    assertRoundingMode(mode, "mode");
    if (!Number.isInteger(digits) || digits < 1) {
        throw new RangeError(
            `digits must be a positive integer. Received ${String(digits)}.`,
        );
    }
    if (!Number.isFinite(value)) {
        return undefined;
    }
    if (value === 0) {
        return value;
    }
    // A double has no further decimal digits past this point.
    if (digits > 17) {
        return value;
    }
    const absolute = Math.abs(value);
    const power = Math.floor(Math.log10(absolute));
    let exponent = Number.isFinite(power) ? power : 0;
    let magnitude = absolute / 10 ** exponent;
    if (!Number.isFinite(magnitude) || magnitude === 0) {
        return value;
    }
    if (magnitude >= 10) {
        magnitude /= 10;
        exponent += 1;
    } else if (magnitude < 1) {
        magnitude *= 10;
        exponent -= 1;
    }
    const rounded = roundNumber({
        value: value < 0 ? -magnitude : magnitude,
        precision: digits - 1,
        mode,
    });
    if (rounded === undefined) {
        return undefined;
    }
    const result = rounded * 10 ** exponent;
    return Number.isFinite(result) ? result : undefined;
}
