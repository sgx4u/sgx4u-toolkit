/**
 * Which IP version `isIP` accepts.
 *
 * `"any"` allows IPv4 and IPv6.
 */
export type IPVersion = 4 | 6 | "any";

/**
 * Options for `isIP`.
 */
export interface IsIPOptions {
    /** The address to test. */
    value: string;
    /**
     * Address version to accept.
     *
     * @defaultValue `"any"`
     */
    version?: IPVersion;
}
