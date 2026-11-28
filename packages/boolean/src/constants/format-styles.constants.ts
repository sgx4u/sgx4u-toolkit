import type {
    BooleanCapitalization,
    BooleanFormatStyle,
} from "../types/format-options.types.js";

/**
 * Styles `formatBoolean` accepts, in documentation order.
 */
export const booleanFormatStyles: readonly BooleanFormatStyle[] = [
    "true-false",
    "yes-no",
    "on-off",
    "enabled-disabled",
    "y-n",
    "t-f",
    "1-0",
];

/**
 * Capitalization settings `formatBoolean` accepts.
 */
export const booleanCapitalizations: readonly BooleanCapitalization[] = [
    "lower",
    "sentence",
    "upper",
];

/**
 * Lowercase English spelling for each style, as `[trueWord, falseWord]`.
 *
 * `yes-no` and `y-n` may be replaced by a locale's primary word later.
 */
export const englishStyleWords: Readonly<
    Record<BooleanFormatStyle, readonly [string, string]>
> = {
    "true-false": ["true", "false"],
    "yes-no": ["yes", "no"],
    "on-off": ["on", "off"],
    "enabled-disabled": ["enabled", "disabled"],
    "y-n": ["y", "n"],
    "t-f": ["t", "f"],
    "1-0": ["1", "0"],
};
