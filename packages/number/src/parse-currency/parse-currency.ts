import { parseCurrencyText } from "../utils/parse-text.utils.js";

/**
 * Strips a locale currency symbol or code, then parses the remaining locale number.
 *
 * @throws {@link RangeError} When `locale` or `currency` is passed and is not valid.
 *
 * @example
 * parseCurrency({ value: "₹1,00,000", locale: "en-IN", currency: "INR" });
 */
export function parseCurrency(parameters: {
    value: string;
    locale?: string | readonly string[];
    currency?: string;
}): number | undefined {
    return parseCurrencyText(
        parameters.value,
        parameters.locale,
        parameters.currency,
    );
}
