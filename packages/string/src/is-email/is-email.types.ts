/**
 * Options for `isEmail`.
 *
 * The check is a practical address shape. It is not an RFC 5322 parser.
 */
export interface IsEmailOptions {
    /** The address to test. */
    value: string;
    /**
     * When `true`, `Name <user@example.com>` is accepted.
     *
     * The address inside the angles uses the same rules as a bare address.
     *
     * @defaultValue false
     */
    allowDisplayName?: boolean;
    /**
     * When `true`, the domain must contain a dot and a top-level label of
     * at least two letters.
     *
     * @defaultValue true
     */
    requireTopLevelDomain?: boolean;
    /**
     * When `true`, a domain of `[IPv4]` or `[IPv6]` is accepted.
     *
     * @defaultValue false
     */
    allowIPDomain?: boolean;
    /**
     * When `true`, Unicode letters and numbers are allowed in the local part.
     *
     * The domain stays ASCII. Set this to `false` for an ASCII local part.
     *
     * @defaultValue true
     */
    allowUTF8LocalPart?: boolean;
}
