import type { DateInput } from "../types/date-input.types.js";
import type { Duration } from "../types/duration.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Fields for {@link compareDurations}.
 */
export interface CompareDurationsParams extends TimeZoneOptions {
    /**
     * The first duration.
     */
    first: Duration;
    /**
     * The second duration.
     */
    second: Duration;
    /**
     * The instant used when either duration has months or years.
     */
    relativeTo?: DateInput;
}
