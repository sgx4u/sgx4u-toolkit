/**
 * Options for `isFQDN`.
 */
export interface IsFQDNOptions {
    /** The hostname to test. */
    value: string;
    /**
     * When `true`, the name needs a dot and a top-level label of at least
     * two letters, or a `xn--` punycode label.
     *
     * @defaultValue true
     */
    requireTopLevelDomain?: boolean;
    /**
     * When `true`, `_` may appear inside a label.
     *
     * @defaultValue false
     */
    allowUnderscore?: boolean;
    /**
     * When `true`, a single leading `*.` wildcard label is accepted.
     *
     * @defaultValue false
     */
    allowWildcard?: boolean;
}
