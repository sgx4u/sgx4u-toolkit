/**
 * Options for `isAlpha`.
 */
export interface IsAlphaOptions {
    /** The string to test. */
    value: string;
    /**
     * `"ascii"` allows only A-Z and a-z. A BCP 47 tag limits letters to
     * that language's usual script.
     */
    locale?: string;
}
