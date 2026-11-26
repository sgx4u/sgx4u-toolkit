import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { RoundingMode, TimeUnit } from "../types/time.types.js";

/**
 * How fractional units are rounded.
 */
export interface DifferenceInUnitOptions extends TimeZoneOptions {
    /**
     * How to treat a fractional unit count.
     *
     * @defaultValue `"truncate"`
     */
    rounding?: RoundingMode;
}

/**
 * Fields for {@link differenceInUnit}.
 */
export interface DifferenceInUnitParams extends DifferenceInUnitOptions {
    /**
     * The end instant.
     */
    later: DateInput;
    /**
     * The start instant.
     */
    earlier: DateInput;
    /**
     * The unit to count.
     */
    unit: TimeUnit;
}
