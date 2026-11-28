/** Options for `splitOnce`. */
export interface SplitOnceOptions {
    /** The text to split. */
    value: string;
    /** The literal separator. An empty string throws. */
    separator: string;
    /** @defaultValue `"start"` */
    from?: "start" | "end";
}
