import type { CompactDisplay } from "./format-display.types.js";
import type { NumberNotation } from "./format-display.types.js";
import type { SignDisplay } from "./format-display.types.js";
import type { TrailingZeroDisplay } from "./format-display.types.js";
import type { UseGrouping } from "./format-display.types.js";
import type { RoundingMode } from "./rounding-mode.types.js";

/**
 * Fields shared by the number formatters.
 *
 * Omitted fields use the `Intl.NumberFormat` default for that locale, except
 * `roundingMode`, which this package treats as `"halfExpand"` when the
 * formatter is building text and the caller did not set one.
 */
export interface NumberFormatFields {
    /**
     * Locale or locale list passed to `Intl`.
     *
     * @defaultValue The runtime locale.
     */
    locale?: string | readonly string[];
    /** Minimum number of digits after the decimal separator. */
    minimumFractionDigits?: number;
    /** Maximum number of digits after the decimal separator. */
    maximumFractionDigits?: number;
    /** Minimum number of significant digits. */
    minimumSignificantDigits?: number;
    /** Maximum number of significant digits. */
    maximumSignificantDigits?: number;
    /**
     * When grouping separators are shown.
     *
     * @defaultValue `"auto"`
     */
    useGrouping?: UseGrouping;
    /**
     * Numbering system, such as `"latn"` or `"arab"`.
     *
     * @defaultValue The locale default.
     */
    numberingSystem?: string;
    /**
     * Rounding mode used while formatting.
     *
     * @defaultValue `"halfExpand"`
     */
    roundingMode?: RoundingMode;
    /**
     * Which signs to show.
     *
     * @defaultValue `"auto"`
     */
    signDisplay?: SignDisplay;
    /**
     * Whether trailing zeros stay on integers.
     *
     * @defaultValue `"auto"`
     */
    trailingZeroDisplay?: TrailingZeroDisplay;
    /**
     * Notation for large and small numbers.
     *
     * @defaultValue `"standard"`
     */
    notation?: NumberNotation;
    /**
     * Compact suffix length. Used when `notation` is `"compact"`.
     *
     * @defaultValue `"short"`
     */
    compactDisplay?: CompactDisplay;
}
