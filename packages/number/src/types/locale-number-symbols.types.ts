/**
 * Characters a locale uses when it prints a number.
 *
 * The strings come from `Intl.NumberFormat` for that locale.
 */
export interface LocaleNumberSymbols {
    /** Character between the whole and fractional parts. */
    decimal: string;
    /** Character between digit groups. */
    group: string;
    /** Sign used before a positive number when a sign is shown. */
    plusSign: string;
    /** Sign used before a negative number. */
    minusSign: string;
    /** Sign used for a percent-formatted number. */
    percentSign: string;
    /** Word or symbol used for positive infinity. */
    infinity: string;
    /** Word or symbol used for not-a-number. */
    nan: string;
    /** Characters between a significand and its exponent. */
    exponentSeparator: string;
}
