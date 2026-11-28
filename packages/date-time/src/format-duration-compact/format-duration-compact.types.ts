import type { Duration } from "../types/duration.types.js";

/**
 * How many compact units to print.
 */
export interface FormatDurationCompactOptions {
    /**
     * The maximum number of non-zero units.
     *
     * @defaultValue `2`
     */
    maximumUnitCount?: number;
    /**
     * The text between units.
     *
     * @defaultValue `" "`
     */
    separator?: string;
}

/**
 * Fields for {@link formatDurationCompact}.
 */
export interface FormatDurationCompactParams extends FormatDurationCompactOptions {
    /**
     * A duration or a millisecond count.
     */
    duration: Duration | number;
}
