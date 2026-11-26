/**
 * How a UTC offset is written.
 */
export interface FormatUTCOffsetOptions {
    /**
     * `extended` is `+05:30`, `basic` is `+0530`, and `short` drops a leading zero.
     *
     * @defaultValue `"extended"`
     */
    style?: "extended" | "basic" | "short";
    /**
     * Whether a zero offset is `Z`.
     *
     * @defaultValue `false`
     */
    useZForZero?: boolean;
}

/**
 * Fields for {@link formatUTCOffset}.
 */
export interface FormatUTCOffsetParams extends FormatUTCOffsetOptions {
    /**
     * Minutes east of UTC. A fraction is kept in the minutes.
     */
    offsetMinutes: number;
}
