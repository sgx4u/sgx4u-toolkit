import { formatFiniteNumber } from "../utils/format-number.utils.js";

/**
 * Formats a finite number with an exponent that is a multiple of 3. `maximumSignificantDigits` defaults to 3.
 *
 * @throws {@link RangeError} When `locale` is invalid.
 *
 * @example
 * formatEngineeringNotation({ value: 12345, locale: "en-US" });
 */
export function formatEngineeringNotation(parameters: {
    value: number;
    locale?: string | readonly string[];
    maximumSignificantDigits?: number;
}): string | undefined {
    return formatFiniteNumber(parameters.value, {
        notation: "engineering",
        maximumSignificantDigits: parameters.maximumSignificantDigits ?? 3,
        ...(parameters.locale === undefined
            ? {}
            : { locale: parameters.locale }),
    });
}
