import type {
    CompactDisplay,
    NumberNotation,
    SignDisplay,
    TrailingZeroDisplay,
    UseGrouping,
} from "../types/format-display.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import { formatFiniteParts } from "../utils/format-number.utils.js";

/**
 * Returns the `Intl.NumberFormatPart` list for a finite number.
 *
 * @throws {@link RangeError} When `locale`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * getNumberFormatParts({ value: 1.5, locale: "en-US" });
 */
export function getNumberFormatParts(parameters: {
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
}): Intl.NumberFormatPart[] | undefined {
    const { value, ...request } = parameters;
    return formatFiniteParts(value, request);
}
