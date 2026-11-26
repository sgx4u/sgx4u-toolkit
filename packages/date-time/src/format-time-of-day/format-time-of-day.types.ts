import type { TimeOfDay } from "../types/time.types.js";
import type { LocaleOptions } from "../types/options.types.js";

/**
 * How a time of day is written.
 */
export interface FormatTimeOfDayOptions extends LocaleOptions {
    /**
     * Which fields are shown.
     *
     * @defaultValue `"minute"`
     */
    precision?: "minute" | "second" | "millisecond";
    /**
     * A 12-hour or 24-hour clock. Omitted uses the locale's cycle.
     */
    hourCycle?: "h12" | "h23";
}

/**
 * Fields for {@link formatTimeOfDay}.
 */
export interface FormatTimeOfDayParams extends FormatTimeOfDayOptions {
    /**
     * The time to format.
     */
    time: TimeOfDay;
}
