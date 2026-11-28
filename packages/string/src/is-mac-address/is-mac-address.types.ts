/**
 * MAC address grouping accepted by `isMACAddress`.
 *
 * `"colon"` is `aa:bb:cc:dd:ee:ff`. `"hyphen"` uses `-`. `"dot"` is the
 * Cisco form `aabb.ccdd.eeff`. `"bare"` is 12 hexadecimal digits.
 * `"any"` accepts all four.
 */
export type MACAddressFormat = "any" | "colon" | "hyphen" | "dot" | "bare";

/**
 * Options for `isMACAddress`.
 */
export interface IsMACAddressOptions {
    /** The address to test. */
    value: string;
    /**
     * Which grouping to accept.
     *
     * @defaultValue `"any"`
     */
    format?: MACAddressFormat;
}
