import type { DateInput } from "../types/date-input.types.js";
import type {
    LocaleOptions,
    NowOptions,
    TimeZoneOptions,
} from "../types/options.types.js";

/**
 * How a nearby calendar day is written.
 */
export interface FormatRelativeCalendarDayOptions
    extends NowOptions, TimeZoneOptions, LocaleOptions {
    /**
     * The length of the time.
     *
     * @defaultValue `"short"`
     */
    timeStyle?: "short" | "medium";
}

/**
 * Fields for {@link formatRelativeCalendarDay}.
 */
export interface FormatRelativeCalendarDayParams extends FormatRelativeCalendarDayOptions {
    /**
     * The date to describe.
     */
    date: DateInput;
}
