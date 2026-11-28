/**
 * Word pair `formatBoolean` can emit.
 *
 * `yes-no` and `y-n` use a locale's primary yes/no word when that language
 * is in the table and is not English. The other styles ignore `locale`.
 */
export type BooleanFormatStyle =
    | "true-false"
    | "yes-no"
    | "on-off"
    | "enabled-disabled"
    | "y-n"
    | "t-f"
    | "1-0";

/**
 * How `formatBoolean` adjusts the case of the emitted word.
 *
 * `"lower"` keeps the stored spelling, including scripts without case.
 * `"1-0"` has no letters, so every setting leaves `1` and `0` unchanged.
 */
export type BooleanCapitalization = "lower" | "sentence" | "upper";

/**
 * Argument for `formatBoolean`.
 */
export interface FormatBooleanInput {
    /** Value to format. Only a primitive boolean produces a string. */
    value: unknown;

    /**
     * Word pair to emit.
     *
     * @defaultValue "true-false"
     */
    style?: BooleanFormatStyle;

    /**
     * BCP 47 tag used for `yes-no`, `y-n`, and case conversion.
     *
     * @defaultValue "en"
     */
    locale?: string;

    /**
     * Case applied to the emitted word.
     *
     * @defaultValue "lower"
     */
    capitalization?: BooleanCapitalization;
}
