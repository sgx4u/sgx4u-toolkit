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
 * Formats a finite number with `Intl.NumberFormat`. A non-finite value returns `undefined` and is not printed as `NaN` or infinity.
 *
 * @throws {@link RangeError} When `locale`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * formatNumber({ value: 1234.5, locale: "en-US" });
 */
export function formatNumber(parameters: {
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
    return formatFiniteNumber(value, request);
}
