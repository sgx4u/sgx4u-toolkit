/**
 * How many compact units to print.
 */
export interface FormatDurationCompactOptions {
    /**
     * The maximum number of non-zero units.
     *
     * @defaultValue `2`
     */
    maximumUnitCount?: number;
    /**
     * The text between units.
     *
     * @defaultValue `" "`
     */
    separator?: string;
}
