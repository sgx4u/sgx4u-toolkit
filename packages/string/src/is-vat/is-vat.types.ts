/**
 * Options for `isVAT`.
 */
export interface IsVATOptions {
    /** The VAT number, with or without the prefix when `country` is set. */
    value: string;
    /**
     * Expected prefix. When omitted, the prefix is the first two letters
     * of `value`. An unknown code throws `RangeError`.
     */
    country?: string;
}
