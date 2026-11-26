import type { Duration } from "../types/duration.types.js";

/**
 * How a clock-style duration is written.
 */
export interface FormatDurationAsClockOptions {
    /**
     * Whether a zero hour field is kept.
     *
     * @defaultValue `true`
     */
    alwaysShowHours?: boolean;
    /**
     * Whether milliseconds are appended.
     *
     * @defaultValue `false`
     */
    showMilliseconds?: boolean;
}

/**
 * Fields for {@link formatDurationAsClock}.
 */
export interface FormatDurationAsClockParams extends FormatDurationAsClockOptions {
    /**
     * A duration or a millisecond count.
     */
    duration: Duration | number;
}
