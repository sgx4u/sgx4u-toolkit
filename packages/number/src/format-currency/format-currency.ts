import type {
    CompactDisplay,
    CurrencyDisplay,
    CurrencySign,
    NumberNotation,
    SignDisplay,
    TrailingZeroDisplay,
    UseGrouping,
} from "../types/format-display.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import { formatFiniteNumber } from "../utils/format-number.utils.js";

/**
 * Formats a finite amount as currency. `currency` is required on the call or on a `createNumber` instance.
 *
 * @throws {@link RangeError} When `currency` is missing or `locale`, `currency`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * formatCurrency({ value: 12, currency: "USD", locale: "en-US" });
 */
export function formatCurrency(parameters: {
    value: number;
    currency: string;
    currencyDisplay?: CurrencyDisplay;
    currencySign?: CurrencySign;
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
    return formatFiniteNumber(value, { ...request, style: "currency" });
}
