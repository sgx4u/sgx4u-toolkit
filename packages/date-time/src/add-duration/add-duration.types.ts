import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type {
    DisambiguationOptions,
    Overflow,
    TimeZoneOptions,
} from "../types/options.types.js";

/**
 * How calendar addition resolves a missing day and a daylight-saving gap.
 */
export interface AddDurationOptions
    extends TimeZoneOptions, DisambiguationOptions {
    /**
     * What to do when the day does not exist in the target month.
     *
     * @defaultValue `"constrain"`
     */
    overflow?: Overflow;
}

/**
 * Fields for {@link addDuration}.
 */
export interface AddDurationParams extends AddDurationOptions {
    /**
     * The starting instant.
     */
    date: DateInput;
    /**
     * The length to add. Every field must share one sign.
     */
    duration: Duration;
}
