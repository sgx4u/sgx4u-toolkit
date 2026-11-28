import type { RoundingMode } from "../types/rounding-mode.types.js";
import { defaultRoundingMode } from "../constants/number-defaults.constants.js";
import {
    assertPrecision,
    assertRoundingMode,
    roundDecimal,
} from "../utils/round-decimal.utils.js";

/**
 * Rounds `value` to `precision` decimal places. A negative precision rounds to tens, hundreds, and so on. The mode matches `Intl.NumberFormat` and defaults to `halfExpand`.
 *
 * @throws {@link RangeError} When `mode` is unknown or `precision` is not an integer from -308 to 308.
 *
 * @example
 * roundNumber({ value: 1.5 });
 */
export function roundNumber(parameters: {
    value: number;
    precision?: number;
    mode?: RoundingMode;
}): number | undefined {
    const precision = parameters.precision ?? 0;
    const mode = parameters.mode ?? defaultRoundingMode;
    assertPrecision(precision, "precision");
    assertRoundingMode(mode, "mode");
    return roundDecimal(parameters.value, precision, mode);
}
