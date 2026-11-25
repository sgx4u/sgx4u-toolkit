import type { LocaleOptions } from "../types/options.types.js";
import { parseDateWithPattern } from "../parse-date-with-pattern/parse-date-with-pattern.js";

/**
 * Reports whether text fits a date pattern and is a real date.
 *
 * @param value - The text to test.
 * @param pattern - The CLDR-style pattern.
 * @param options - `locale` is accepted for name tokens.
 * @returns `true` when the text parses as a real date.
 * @throws {@link TypeError} When `value` or `pattern` is not a string.
 * @throws {@link RangeError} When the pattern contains an unknown token.
 * @example
 * matchesDatePattern("2026-11-26", "yyyy-MM-dd"); // true
 */
export function matchesDatePattern(
    value: string,
    pattern: string,
    options?: LocaleOptions,
): boolean {
    return (
        parseDateWithPattern(value, pattern, {
            timeZone: "UTC",
            ...(options?.locale !== undefined
                ? { locale: options.locale }
                : {}),
        }) !== undefined
    );
}
