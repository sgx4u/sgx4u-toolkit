import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link durationToMilliseconds}.
 */
export interface DurationToMillisecondsParams extends TimeZoneOptions {
    /**
     * The duration to measure.
     */
    duration: Duration;
    /**
     * The instant used when the duration contains months or years.
     */
    relativeTo?: DateInput;
}
