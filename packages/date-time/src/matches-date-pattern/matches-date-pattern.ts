import type { LocaleOptions } from "../types/options.types.js";
import { typeError } from "../utils/error.utils.js";
import { parseDateWithPattern } from "../parse-date-with-pattern/parse-date-with-pattern.js";

/**
 * Fields for {@link matchesDatePattern}.
 */
export interface MatchesDatePatternParams extends LocaleOptions {
    /**
     * The text to test.
     */
    value: string;
    /**
     * The CLDR-style pattern.
     */
    pattern: string;
}

/**
 * Reports whether text fits a date pattern and is a real date.
 *
 * @param params - `value` and `pattern` are required. `locale` is accepted for name tokens.
 * @returns `true` when the text parses as a real date.
 * @throws {@link TypeError} When `value` or `pattern` is not a string.
 * @throws {@link RangeError} When the pattern contains an unknown token.
 * @example
 * matchesDatePattern({ value: "2026-11-26", pattern: "yyyy-MM-dd" }); // true
 */
export function matchesDatePattern({
    value,
    pattern,
    locale,
}: MatchesDatePatternParams): boolean {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    if (typeof pattern !== "string") {
        throw typeError("pattern", "a string", pattern);
    }
    return (
        parseDateWithPattern({
            value,
            pattern,
            timeZone: "UTC",
            ...(locale !== undefined ? { locale } : {}),
        }) !== undefined
    );
}
