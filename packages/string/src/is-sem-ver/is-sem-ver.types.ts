/**
 * Options for `isSemVer`.
 */
export interface IsSemVerOptions {
    /** The version to test. */
    value: string;
    /**
     * When `true`, one leading `v` or `V` is accepted.
     *
     * @defaultValue false
     */
    allowPrefixV?: boolean;
}
