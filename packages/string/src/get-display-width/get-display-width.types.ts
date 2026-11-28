/**
 * Options for `getDisplayWidth`.
 */
export interface GetDisplayWidthOptions {
    /** The text to measure. */
    value: string;
    /**
     * When `true`, each code unit of an ANSI escape counts as width 1.
     *
     * @defaultValue false
     */
    countAnsiEscapeCodes?: boolean;
}
