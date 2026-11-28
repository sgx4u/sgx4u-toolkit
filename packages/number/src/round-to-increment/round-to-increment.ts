import type { RoundingMode } from "../types/rounding-mode.types.js";
import { defaultRoundingMode } from "../constants/number-defaults.constants.js";
import {
    divideDecimal,
    multiplyDecimal,
} from "../utils/decimal-arithmetic.utils.js";
import { assertRoundingMode } from "../utils/round-decimal.utils.js";
import { roundNumber } from "../round-number/round-number.js";

/**
 * Rounds `value` to the nearest multiple of a positive `increment`.
 *
 * @throws {@link RangeError} When `mode` is unknown.
 *
 * @example
 * roundToIncrement({ value: 7, increment: 5 });
 */
export function roundToIncrement(parameters: {
    value: number;
    increment: number;
    mode?: RoundingMode;
}): number | undefined {
    const { value, increment, mode = defaultRoundingMode } = parameters;
    assertRoundingMode(mode, "mode");
    if (
        !Number.isFinite(value) ||
        !Number.isFinite(increment) ||
        increment <= 0
    ) {
        return undefined;
    }
    const scaled = divideDecimal(value, increment);
    if (scaled === undefined) {
        return undefined;
    }
    const rounded = roundNumber({ value: scaled, mode });
    if (rounded === undefined) {
        return undefined;
    }
    return multiplyDecimal(rounded, increment);
}
