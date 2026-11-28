import type { Duration } from "../types/duration.types.js";
import type { Interval } from "../types/interval.types.js";
import type { TimeZoneOptions } from "../types/options.types.js";
import type { TimeRange } from "../types/time.types.js";

/**
 * Fields for {@link findAvailableSlots}.
 */
export interface FindAvailableSlotsParams extends TimeZoneOptions {
    /**
     * Intervals that are already taken.
     */
    busy: readonly Interval[];
    /**
     * The window that may contain slots.
     */
    within: Interval;
    /**
     * The exact length of every returned slot.
     */
    slotDuration: Duration;
    /**
     * How far the start of the next slot moves. Defaults to `slotDuration`.
     */
    step?: Duration;
    /**
     * When set, a slot must lie inside this window on its calendar day.
     */
    dailyWindow?: TimeRange;
}
