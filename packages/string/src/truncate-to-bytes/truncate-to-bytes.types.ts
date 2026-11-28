/** Options for `truncateToBytes`. */
export interface TruncateToBytesOptions {
    /** The text to shorten. */
    value: string;
    /** The maximum UTF-8 size of the result. */
    maximumBytes: number;
    /** @defaultValue `"\u2026"` */
    omission?: string;
}
