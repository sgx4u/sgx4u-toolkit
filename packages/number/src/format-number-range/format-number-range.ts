import type {
    SignDisplay,
    UseGrouping,
} from "../types/format-display.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import { formatFiniteRange } from "../utils/format-number.utils.js";

/**
 * Formats a finite numeric range. Uses `Intl.NumberFormat.formatRange` when it exists, otherwise joins the two formatted numbers with an en dash.
 *
 * @throws {@link RangeError} When `locale`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * formatNumberRange({ start: 1, end: 2, locale: "en-US" });
 */
export function formatNumberRange(parameters: {
    start: number;
    end: number;
    locale?: string | readonly string[];
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: UseGrouping;
    numberingSystem?: string;
    roundingMode?: RoundingMode;
    signDisplay?: SignDisplay;
}): string | undefined {
    const { start, end, ...request } = parameters;
    return formatFiniteRange(start, end, request);
}
