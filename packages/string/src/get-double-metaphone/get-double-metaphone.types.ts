/**
 * The two codes from {@link getDoubleMetaphone}.
 *
 * Each code is at most four characters. When the word has no alternate
 * pronunciation, `secondary` equals `primary`.
 */
export interface DoubleMetaphoneCode {
    /** The primary pronunciation. */
    primary: string;
    /** The alternate pronunciation, or a copy of `primary`. */
    secondary: string;
}
