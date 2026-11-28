/**
 * Options for `isNumericString`.
 */
export interface IsNumericStringOptions {
    /** The string to test. */
    value: string;
    /**
     * Accept a leading `+` or `-`.
     *
     * @defaultValue false
     */
    allowSign?: boolean;
    /**
     * Accept one decimal point with digits on both sides.
     *
     * @defaultValue false
     */
    allowDecimal?: boolean;
}
