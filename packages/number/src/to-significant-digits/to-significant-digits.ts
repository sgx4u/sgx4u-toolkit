import type { RoundingMode } from "../types/rounding-mode.types.js";
import { defaultRoundingMode } from "../constants/number-defaults.constants.js";
import { assertRoundingMode } from "../utils/round-decimal.utils.js";
import { roundNumber } from "../round-number/round-number.js";

/**
 * Rounds `value` to `digits` significant digits.
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
    const exponent = Math.floor(Math.log10(Math.abs(value)));
    const precision = digits - exponent - 1;
    return roundNumber({ value, precision, mode });
}
