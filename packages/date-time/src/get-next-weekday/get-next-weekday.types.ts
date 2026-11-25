import type { TimeZoneOptions } from "../types/options.types.js";

/**
 * Whether the current day counts when it is already the requested weekday.
 */
export interface WeekdayStepOptions extends TimeZoneOptions {
    /**
     * When `true`, a date that is already that weekday returns the start of that day.
     *
     * @defaultValue `false`
     */
    includeCurrentDay?: boolean;
}
