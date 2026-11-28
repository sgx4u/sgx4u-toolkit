import { formatOrdinalText } from "../utils/format-number.utils.js";

/**
 * Formats the integer part of a finite number as an ordinal. English uses st, nd, rd, and th. French uses er and e. German uses a trailing period. Other locales return the formatted integer.
 *
 * @throws {@link RangeError} When `locale` is invalid.
 *
 * @example
 * formatOrdinal({ value: 1, locale: "en-US" });
 */
export function formatOrdinal(parameters: {
    value: number;
    locale?: string | readonly string[];
}): string | undefined {
    return formatOrdinalText(parameters.value, parameters.locale);
}
