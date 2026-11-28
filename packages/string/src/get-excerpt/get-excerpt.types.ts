/**
 * Options for `getExcerpt`.
 */
export interface GetExcerptOptions {
    /** The text to shorten. */
    value: string;
    /**
     * Maximum graphemes in the result, including the omission.
     *
     * @defaultValue 140
     */
    maximumLength?: number;
    /**
     * When `true`, the cut retreats to the previous word when it would
     * land inside a word.
     *
     * @defaultValue true
     */
    breakOnWord?: boolean;
    /**
     * Text appended when the value is shortened.
     *
     * @defaultValue `"\u2026"`
     */
    omission?: string;
}
