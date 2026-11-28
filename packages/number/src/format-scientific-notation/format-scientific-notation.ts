import { formatFiniteNumber } from "../utils/format-number.utils.js";

/**
 * Formats a finite number in scientific notation.
 *
 * @throws {@link RangeError} When `locale` is invalid.
 *
 * @example
 * formatScientificNotation({ value: 12345, locale: "en-US" });
 */
export function formatScientificNotation(parameters: {
    value: number;
    locale?: string | readonly string[];
    maximumSignificantDigits?: number;
}): string | undefined {
    return formatFiniteNumber(parameters.value, {
        notation: "scientific",
        ...(parameters.locale === undefined
            ? {}
            : { locale: parameters.locale }),
        ...(parameters.maximumSignificantDigits === undefined
            ? {}
            : {
                  maximumSignificantDigits: parameters.maximumSignificantDigits,
              }),
    });
}
