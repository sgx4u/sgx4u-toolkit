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
