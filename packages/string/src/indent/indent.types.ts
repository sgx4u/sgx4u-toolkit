/** Options for `indent`. */
export interface IndentOptions {
    /** The text to indent. */
    value: string;
    /**
     * How many times to repeat `character`.
     *
     * @defaultValue 1
     */
    count?: number;
    /**
     * The indent character.
     *
     * @defaultValue `" "`
     */
    character?: string;
}
