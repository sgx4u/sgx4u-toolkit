/**
 * Options for `isURL`.
 */
export interface IsURLOptions {
    /** The URL to test. */
    value: string;
    /**
     * Protocol names that are accepted, without a trailing colon.
     *
     * Comparison is case-insensitive. A trailing colon on an entry is ignored.
     *
     * @defaultValue `["http", "https"]`
     */
    protocols?: readonly string[];
    /**
     * When `true`, `value` must already include a protocol.
     *
     * When `false`, a value that `URL` cannot parse is tried again with
     * `https://` in front. The allow-list is then applied to the URL that
     * parsed.
     *
     * @defaultValue true
     */
    requireProtocol?: boolean;
    /**
     * When `true`, the hostname needs a dot and a top-level label.
     *
     * IP addresses are not given a pass by this flag. Use `allowIP`.
     *
     * @defaultValue true
     */
    requireTopLevelDomain?: boolean;
    /**
     * When `true`, the hostname `localhost` is accepted.
     *
     * @defaultValue false
     */
    allowLocalhost?: boolean;
    /**
     * When `true`, a username or password in the URL is accepted.
     *
     * @defaultValue false
     */
    allowCredentials?: boolean;
    /**
     * When `true`, an IPv4 or IPv6 hostname is accepted.
     *
     * This bypasses the top-level-domain requirement for that host.
     *
     * @defaultValue false
     */
    allowIP?: boolean;
}
