/**
 * How a UTC offset is written.
 */
export interface FormatUtcOffsetOptions {
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
