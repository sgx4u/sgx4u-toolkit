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
 * Formats a finite number in compact notation. `compactDisplay` defaults to `short`. Indian locales already use lakh and crore units.
 *
 * @throws {@link RangeError} When `locale`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * formatCompactNumber({ value: 1200000, locale: "en-IN" });
 */
export function formatCompactNumber(parameters: {
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
    const { value, compactDisplay = "short", ...request } = parameters;
    return formatFiniteNumber(value, {
        ...request,
        compactDisplay,
        notation: "compact",
    });
}
