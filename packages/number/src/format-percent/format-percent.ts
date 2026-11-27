import type {
    CompactDisplay,
    NumberNotation,
    SignDisplay,
    TrailingZeroDisplay,
    UseGrouping,
} from "../types/format-display.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import { formatFiniteNumber } from "../utils/format-number.utils.js";

/**
 * Formats a ratio as a percent. `0.25` is 25 percent. This is the opposite direction from {@link parsePercent}.
 *
 * @throws {@link RangeError} When `locale`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * formatPercent({ value: 0.25, locale: "en-US" });
 */
export function formatPercent(parameters: {
    value: number;
    locale?: string | readonly string[];
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
    useGrouping?: UseGrouping;
    numberingSystem?: string;
    roundingMode?: RoundingMode;
    signDisplay?: SignDisplay;
    trailingZeroDisplay?: TrailingZeroDisplay;
    notation?: NumberNotation;
    compactDisplay?: CompactDisplay;
}): string | undefined {
    const { value, ...request } = parameters;
    return formatFiniteNumber(value, { ...request, style: "percent" });
}
