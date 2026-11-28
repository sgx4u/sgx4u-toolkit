/**
 * Options for `isAlphanumeric`.
 */
export interface IsAlphanumericOptions {
    /** The string to test. */
    value: string;
    /** `"ascii"` or a BCP 47 tag. See `isAlpha`. */
    locale?: string;
}
