import type { DateInput } from "../types/date-input.types.js";
import type { TimeZoneOptions, WeekOptions } from "../types/options.types.js";
import type { TimeUnit } from "../types/time.types.js";

/**
 * Fields for {@link endOfUnit}.
 */
export interface EndOfUnitParams extends TimeZoneOptions, WeekOptions {
    /**
     * The instant to align.
     */
    date: DateInput;
    /**
     * A time unit, or `"decade"`.
     */
    unit: TimeUnit | "decade";
}
