import type {
    SignDisplay,
    UnitDisplay,
    UseGrouping,
} from "../types/format-display.types.js";
import type { RoundingMode } from "../types/rounding-mode.types.js";
import { formatFiniteNumber } from "../utils/format-number.utils.js";

/**
 * Formats a finite number with an `Intl` unit.
 *
 * @throws {@link RangeError} When `unit`, `locale`, `numberingSystem`, or `roundingMode` is invalid.
 *
 * @example
 * formatUnit({ value: 3, unit: "kilometer", locale: "en-US" });
 */
export function formatUnit(parameters: {
    value: number;
    unit: string;
    locale?: string | readonly string[];
    unitDisplay?: UnitDisplay;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: UseGrouping;
    numberingSystem?: string;
    roundingMode?: RoundingMode;
    signDisplay?: SignDisplay;
}): string | undefined {
    const { value, unit, unitDisplay = "short", ...request } = parameters;
    return formatFiniteNumber(value, {
        ...request,
        unit,
        unitDisplay,
        style: "unit",
    });
}
