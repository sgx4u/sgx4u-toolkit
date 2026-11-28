import type { ByteStandard } from "./byte-standard.types.js";
import type {
    CompactDisplay,
    CurrencyDisplay,
    SignDisplay,
    TrailingZeroDisplay,
    UseGrouping,
} from "./format-display.types.js";
import type { QuantileMethod } from "./quantile-method.types.js";
import type { RoundingMode } from "./rounding-mode.types.js";

/**
 * Defaults bound by `createNumber`.
 *
 * Every field is optional. An omitted field keeps the package default.
 * Per-call properties on an instance method replace the bound value.
 */
export interface NumberConfig {
    /**
     * Locale or locale list passed to `Intl` when a call omits `locale`.
     *
     * @defaultValue The runtime locale.
     */
    locale?: string | readonly string[];
    /**
     * Currency code used when a call omits `currency`.
     *
     * Currency formatting still throws when neither the call nor the config
     * provides one.
     *
     * @defaultValue None.
     */
    currency?: string;
    /**
     * How a currency amount shows its currency.
     *
     * @defaultValue `"symbol"`
     */
    currencyDisplay?: CurrencyDisplay;
    /**
     * Rounding mode used when a call omits one.
     *
     * @defaultValue `"halfExpand"`
     */
    roundingMode?: RoundingMode;
    /**
     * When grouping separators are shown.
     *
     * @defaultValue `"auto"`
     */
    useGrouping?: UseGrouping;
    /**
     * Numbering system passed to `Intl` when a call omits one.
     *
     * @defaultValue The locale default.
     */
    numberingSystem?: string;
    /**
     * Compact suffix length.
     *
     * @defaultValue `"short"`
     */
    compactDisplay?: CompactDisplay;
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
     * Byte scale used by byte helpers on the instance.
     *
     * @defaultValue `"SI"`
     */
    byteStandard?: ByteStandard;
    /**
     * Generator for non-secure random helpers. Must return a number in `[0, 1)`.
     *
     * @defaultValue `Math.random`
     */
    random?: () => number;
    /**
     * Absolute difference that still counts as equal.
     *
     * @defaultValue `0`
     */
    absoluteTolerance?: number;
    /**
     * Relative difference that still counts as equal, scaled by the larger magnitude.
     *
     * @defaultValue `Number.EPSILON * 8`
     */
    relativeTolerance?: number;
    /**
     * Quantile method used when a call omits `method`.
     *
     * @defaultValue `"linear"`
     */
    percentileMethod?: QuantileMethod;
}
