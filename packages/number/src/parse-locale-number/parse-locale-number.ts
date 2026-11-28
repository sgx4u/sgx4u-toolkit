import { parseLocaleNumberText } from "../utils/parse-text.utils.js";

/**
 * Parses a locale-formatted number, including grouping separators such as Indian `12,34,567.89` and German `1.234,56`.
 *
 * @throws {@link RangeError} When `locale` is not a valid locale.
 *
 * @example
 * parseLocaleNumber({ value: "1.234,56", locale: "de-DE" });
 */
export function parseLocaleNumber(parameters: {
    value: string;
    locale?: string | readonly string[];
}): number | undefined {
    return parseLocaleNumberText(parameters.value, parameters.locale);
}
