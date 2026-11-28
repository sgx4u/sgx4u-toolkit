/**
 * Options for `getReadingTime`.
 */
export interface GetReadingTimeOptions {
    /** The text to measure. */
    value: string;
    /**
     * Words read in one minute.
     *
     * @defaultValue 200
     */
    wordsPerMinute?: number;
}
