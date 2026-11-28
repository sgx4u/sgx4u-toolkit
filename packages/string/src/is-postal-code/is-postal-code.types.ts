/**
 * Options for `isPostalCode`.
 */
export interface IsPostalCodeOptions {
    /** The postal code to test. */
    value: string;
    /**
     * ISO 3166-1 alpha-2 country code. Required. Matching ignores case.
     * An unknown code throws `RangeError`.
     */
    country: string;
}
