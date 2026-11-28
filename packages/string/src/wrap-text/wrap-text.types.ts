/** Options for `wrapText`. */
export interface WrapTextOptions {
    /** The text to wrap. */
    value: string;
    /** The maximum display width of a line, including `indent`. */
    maximumWidth: number;
    /** @defaultValue true */
    breakLongWords?: boolean;
    /** @defaultValue `"\n"` */
    newline?: string;
    /** @defaultValue `""` */
    indent?: string;
}
